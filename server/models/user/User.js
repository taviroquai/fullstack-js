const fs = require('fs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const storageConfig = require('../../config/storage');
const Model = require('../Model');
const Role = require('../role/Role');
const bcrypt = require('bcrypt-nodejs');
const validator = require("email-validator");
const pick = require('lodash.pick');
class User extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Set fillable columns
   */
  static fillable() {
    return [
      'username',
      'email',
      'password',
      'active',
      'avatar'
    ];
  }

  /**
   * Filter input
   * @param {Object} input 
   */
  static filterInput(input) {
    return pick(input, User.fillable())
  }

  /**
   * Encrypt password before insert
   */
  async $beforeInsert() {
    if (this.password) {
      this.password = User.hashPassword(this.password);
    }
  }

  /**
   * Encrypt password before insert
   */
  async $beforeUpdate() {
    if (this.password) this.password = User.hashPassword(this.password);
  }

  /**
   * Hash password
   * @param {String} password 
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password);
  }

  /**
   * Verify password
   * @param {String} password 
   */
  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  /**
   * Passwords input
   * @param {Object} input 
   */
  static validateInputPasswords(input) {
    const { password, password_confirm } = input;
    if (password && (password !== password_confirm))
      throw new Error('Passwords did not match');
  }

  /**
   * Validate input email address
   * @param {Object} input 
   */
  static validateInputEmail(input) {
    if (!validator.validate(input.email))
      throw new Error('Invalid email address');
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'email'],
      properties: {
        username: { type: 'string', minLength: 8, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 8, maxLength: 255 },
        avatar: { type: 'string', minLength: 0, maxLength: 255 },
        active: { type: 'boolean' }
      }
    }
  };

  /**
   * Role relation
   */
  static get relationMappings() {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users.role_id',
          to: 'roles.id'
        }
      }
    }
  }

  /**
   * Regenerate Jwt
   * TODO: add expire date
   */
  async regenerateJwt() {
    this.authtoken = jwt.sign({ username: this.username }, authConfig.jwt.secret);
    await User.query()
      .patch({ authtoken: this.authtoken })
      .where('id', this.id);
  }

  /**
   * Store avatar
   * @param {Number} id 
   * @param {FileStream} stream 
   * @param {String} filename 
   */
  static storeAvatar(id, stream, filename) {
    const uploadDir = storageConfig.filesystem.path + '/users/avatar';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); 
    const path = `${uploadDir}/${filename}`
    return new Promise((resolve, reject) =>
      stream
        .on('error', error => {
          if (stream.truncated)
            fs.unlinkSync(path)
          reject(error)
        })
        .pipe(fs.createWriteStream(path))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ id, path }))
    )
  }

  /**
   * Get avatar full filename
   * 
   * @param {Number} id 
   * @param {String} filename 
   */
  static getAvatarPath(id, filename) {
    const dir = storageConfig.filesystem.path + '/users/avatar';
    const path = `${dir}/${filename}`;
    return path;
  }
}

module.exports = User;

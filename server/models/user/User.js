const fs = require('fs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const storageConfig = require('../../config/storage');
const Model = require('../Model');
const bcrypt = require('bcrypt-nodejs');
const validator = require("email-validator");

class User extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'users';
  }

  /**
   * Encrypt password before insert
   */
  async $beforeInsert() {
    if (this.password) this.password = User.hashPassword(this.password);
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
   * Validate email address
   * @param {String} email 
   */
  static validateEmail(email) {
    return validator.validate(email);
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
        password: { type: 'string', minLength: 8, maxLength: 255}
      }
    }
  };

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
            // delete the truncated file
            fs.unlinkSync(path)
          reject(error)
        })
        .pipe(fs.createWriteStream(path))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ id, path }))
    )
  }

  static getAvatarPath(id, filename) {
    const dir = storageConfig.filesystem.path + '/users/avatar';
    const path = `${dir}/${filename}`;
    return path;
    
    /*
    const mime = require('mime');
    const mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
    */
  }

  /**
   * Set relation mappings
   */
  static get relationMappings() {
    return {
      children: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'users.parentId'
        }
      }
    };
  }
}

module.exports = User;

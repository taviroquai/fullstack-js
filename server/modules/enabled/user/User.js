const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const validator = require("email-validator");
const pick = require('lodash.pick');
const Model = use('core/Model');

// Get config
const authSecret = process.env.FSTACK_AUTH_SECRET;
const storagePath = process.env.FSTACK_STORAGE_PATH;

/**
 * User model
 */
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
    if (this.password) this.password = User.hashPassword(this.password);
  }

  /**
   * Encrypt password before insert
   */
  async $beforeUpdate() {
    if (this.password) this.password = User.hashPassword(this.password);
  }

  /**
   * Populate relations
   */
  async $afterInsert() {
    const RoleUser = use('roleuser/RoleUser');
    await RoleUser.populateWithUser(this)
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
   * Create reset password token
   * @param {String} password
   */
  static createResetToken() {
    return bcrypt.hashSync(authSecret + (new Date()).getTime());
  }

  /**
   * Validate reset token
   * @param {Object} input
   */
  static async validateResetToken(input) {
    const user = await User.query()
      .where('resettoken', input.token)
      .first();
    if (!user) throw new Error('ERROR_NOT_FOUND');
    return user;
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
   * Regenerate Jwt
   */
  async regenerateJwt() {
    const options = {
      expiresIn: parseInt(process.env.FSTACK_AUTH_EXPIRES, 10)
    };
    return jwt.sign({ id: this.id }, authSecret, options);
  }

  /**
   * Get user from jwt
   */
  static async getUserFromJwt(jwttoken) {
    try {
      const decoded = jwt.verify(jwttoken, authSecret);
      return await User.query().findOne({ id: decoded.id });
    } catch (err) {
      return null;
    }
  }

  /**
   * Get user from email
   */
  static async getUserFromEmail(email) {
    try {
      return await User.query().findOne({ email });
    } catch (err) {
      return null;
    }
  }

  /**
   * Store avatar
   * @param {Number} id
   * @param {FileStream} stream
   * @param {String} filename
   */
  static storeAvatar(id, stream, filename) {
    let uploadDir = User.getStoragePath(id);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    uploadDir = uploadDir + '/avatar';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    const path = User.getAvatarPath(id, filename);
    return new Promise((resolve, reject) =>
      stream.on('error', error => {
          if (stream.truncated) fs.unlinkSync(path)
          reject(error)
        })
        .pipe(fs.createWriteStream(path))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ id, path }))
    )
  }

  /**
   * Get storage path
   *
   * @param {Number} id
   */
  static getStoragePath(id) {
    return storagePath + '/users/' + id;
  }

  /**
   * Get avatar full filename
   *
   * @param {Number} id
   * @param {String} filename
   */
  static getAvatarPath(id, filename) {
    const dir = User.getStoragePath(id) + '/avatar';
    const path = `${dir}/${filename}`;
    return path;
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
   * Get user's roles from database
   *
   * @param {Object} user
   */
  static async getRoles(user) {
    const RoleUser = use('roleuser/RoleUser');
    let roles = [];
    if (!user) {
      roles = await RoleUser
        .query()
        .eager('role')
        .where('role_id', '1');
    } else {
      roles = await RoleUser
        .query()
        .eager('role')
        .where('user_id', user.id)
        .where('active', true);
    }
    return roles;
  }

  /**
   * Send password recover email
   * @param  {Object} user        The user
   * @param  {String} token       The reset token
   * @param  {String} client_url  The client url
   */
  async sendRecoverPasswordEmail(client_url) {
    const EmailClient = use('core/EmailClient');
    const client = new EmailClient();
    const subject = process.env.FSTACK_MAIL_RESET_SUBJECT;
    const data = { url: client_url + this.resettoken };
    const message = client.composeMessage('reset_password.html', data);
    return await client.send(this.email, message, subject);
  }
}

module.exports = User;

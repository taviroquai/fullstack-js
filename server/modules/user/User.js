const fs = require('fs');
const jwt = require('jsonwebtoken');
const Model = require('../Model');
const bcrypt = require('bcrypt-nodejs');
const validator = require("email-validator");
const pick = require('lodash.pick');

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
    const RoleUser = require('../roleuser/RoleUser');
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
    const user = await User.query().where('resettoken', input.token).first();
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
   * Store avatar
   * @param {Number} id
   * @param {FileStream} stream
   * @param {String} filename
   */
  static storeAvatar(id, stream, filename) {
    const uploadDir = storagePath + '/users/avatar';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    const path = `${uploadDir}/${filename}`
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
   * Get avatar full filename
   *
   * @param {Number} id
   * @param {String} filename
   */
  static getAvatarPath(id, filename) {
    const dir = storagePath + '/users/avatar';
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
   * Role relation
   */
  static get relationMappings() {
    const Role = require('../role/Role');
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
   * Send password recover email
   * @param  {Object} user        The user
   * @param  {String} token       The reset token
   * @param  {String} client_url  The client url
   */
  static recoverSendEmail(user, token, client_url) {

    // Require dependencies
    const nodemailer = require('nodemailer');
    const HtmlEntities = require('html-entities').XmlEntities;

    // Validate template
    const dest = process.cwd()
    const folder = dest + '/templates'
    const filename = folder + '/reset_password.html';
    if (!fs.existsSync(filename)) {
        console.log('ERROR: missing template: ' + filename);
        throw new Error('ERROR: missing template: ' + filename);
    }

    // Load template
    let template = fs.readFileSync(filename, 'utf8')
    let placeholders = {};
    placeholders.url = client_url + token
    placeholders.token = token

    // Replace placeholders
    var regex, emailText, emailHTML
    for (var key in placeholders) {
        regex = new RegExp('\\['+key+'\\]', "g")
        template = template.replace(regex, placeholders[key])
    }

    // Convert all html entities
    const entities = new HtmlEntities()
    emailHTML = entities.decode(template)
    emailHTML = emailHTML.replace(/\r?\n/g, "<br />")
    emailText = entities.decode(template).replace(/<\/?[^>]+(>|$)/g, "")

    // create reusable transporter object using the default SMTP transport
    const transportConfig = {
      host: process.env.FSTACK_MAIL_HOST,
      port: parseInt(process.env.FSTACK_MAIL_PORT, 10),
      tls: {
        rejectUnauthorized: !!process.env.FSTACK_MAIL_REJECT_UNAUTH
      },
      secure: !!process.env.FSTACK_MAIL_SECURE,
      auth: {
        user: process.env.FSTACK_MAIL_USER,
        pass: process.env.FSTACK_MAIL_PASS
      }
    };
    const transporter = nodemailer.createTransport(transportConfig);

    // setup email data with unicode symbols
    const mailOptions = {
        from: process.env.FSTACK_MAIL_FROM,
        to: user.email,
        subject: process.env.FSTACK_MAIL_RESET_SUBJECT,
        text: emailText,
        html: emailHTML
    };

    // send mail with defined transport object
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject();
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        resolve(true);
      });
    });
  }
}

module.exports = User;

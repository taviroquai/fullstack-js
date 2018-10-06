const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const Model = require('../Model');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  /**
   * Regenerate Jwt
   * TODO: add expire date
   */
  regenerateJwt() {
    this.authtoken = jwt.sign({ username: this.username }, authConfig.jwt.secret);
  }

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

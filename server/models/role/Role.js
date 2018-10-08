const Model = require('../Model');

class Role extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'roles';
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['label', 'system'],
      properties: {
        label: { type: 'string', minLength: 3, maxLength: 255 },
        system: { type: 'string', minLength: 3, maxLength: 255 }
      }
    }
  };

  /**
   * Set relation mappings
   */
  static get relationMappings() {
    const User = require('../user/User');
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          to: 'users.role_id'
        }
      }
    };
  }

}

module.exports = Role;

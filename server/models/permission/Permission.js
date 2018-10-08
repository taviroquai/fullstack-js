const Model = require('../Model');
const Role = require('../role/Role');
const Resource = require('../resource/Resource');

class Permission extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'permissions';
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['access'],
      properties: {
        access: { type: 'boolean' }
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
          from: 'permissions.role_id',
          to: 'roles.id'
        }
      },
      resource: {
        relation: Model.BelongsToOneRelation,
        modelClass: Resource,
        join: {
          from: 'permissions.resource_id',
          to: 'resources.id'
        }
      }
    }
  }
}

module.exports = Permission;

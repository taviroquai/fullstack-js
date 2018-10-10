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

  /**
   * Populate with resource
   */
  static async populateWithResource(resource) {
    const Role = require('../role/Role');
    const roles = await Role.query();
    const items = [];
    for (let i = 0; i < roles.length; i++) items.push({
      resource_id: resource.id,
      role_id: roles[i].id,
      access: roles[i].system === 'ANONYMOUS' ? false : true
    });
    await Resource.knex().table('permissions').insert(items);
  }

  /**
   * Populate with role
   */
  static async populateWithRole(role) {
    const Resource = require('../resource/Resource');
    const resources = await Resource.query();
    const items = [];
    for (let i = 0; i < resources.length; i++) items.push({
      resource_id: resources[i].id,
      role_id: role.id,
      access: roles[i].system === 'ANONYMOUS' ? false : true
    });
    await Resource.knex().table('permissions').insert(items);
  }
}

module.exports = Permission;

const Model = use('core/Model');
const Role = require('./Role');

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
      }
    }
  }

  /**
   * Populate with role
   */
  static async populateWithRole(role) {
    const ModuleManager = use('core/ModuleManager');
    const resources = ModuleManager.getResourcesNames();
    const items = [];
    for (let r of resources) items.push({
      resource: r,
      role_id: role.id,
      access: role.system === 'ANONYMOUS' ? false : true
    });
    await Permission.knex().table('permissions').insert(items);
  }
}

module.exports = Permission;

const Model = require('../Model');
const Role = require('../role/Role');
const Hook = require('../hook/Hook');

class RoleHook extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'role_hooks';
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role_id', 'hook_id', 'bypass'],
      properties: {
        bypass: { type: 'boolean' }
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
          from: 'role_hooks.role_id',
          to: 'roles.id'
        }
      },
      hook: {
        relation: Model.BelongsToOneRelation,
        modelClass: Hook,
        join: {
          from: 'role_hooks.hook_id',
          to: 'hooks.id'
        }
      }
    }
  }

  /**
   * Populate with role
   */
  static async populateWithRole(role) {
    const Hook = require('../hook/Hook');
    const hooks = await Hook.query();
    const items = [];
    for (let i of hooks) items.push({
      role_id: role.id,
      hook_id: i.id,
      bypass: false
    });
    await RoleHook.query().insert(items)
  }

  /**
   * Populate with hook
   */
  static async populateWithHook(hook) {
    const Role = require('../role/Role');
    const roles = await Role.query();
    const items = [];
    for (let i of roles) items.push({
      role_id: i.id,
      hook_id: hook.id,
      bypass: false
    });
    await RoleHook.query().insert(items)
  }
}

module.exports = RoleHook;

const Model = require('../Model');

class ResourceHook extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'resource_hooks';
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['resource', 'hook', 'active'],
      properties: {
        active: { type: 'boolean' }
      }
    }
  };

  /**
   * Populate with hook
   */
  static async populateWithHook(hook) {
    const ModuleManager = require('../../ModuleManager');
    const resources = ModuleManager.getResourcesNames();
    const items = [];
    for (let r of resources) items.push({
      resource: r,
      hook_id: hook.id,
      active: false
    });
    await ResourceHook.query().insert(items)
  }
}

module.exports = ResourceHook;

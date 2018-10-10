const Model = require('../Model');
const Resource = require('../resource/Resource');
const Hook = require('../hook/Hook');

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
      required: ['resource_id', 'hook_id', 'active'],
      properties: {
        active: { type: 'boolean' }
      }
    }
  };

  /**
   * Resource relation
   */
  static get relationMappings() {
    return {
      resource: {
        relation: Model.BelongsToOneRelation,
        modelClass: Resource,
        join: {
          from: 'resource_hooks.resource_id',
          to: 'resources.id'
        }
      },
      hook: {
        relation: Model.BelongsToOneRelation,
        modelClass: Hook,
        join: {
          from: 'resource_hooks.hook_id',
          to: 'hooks.id'
        }
      }
    }
  }

  /**
   * Populate with resource
   */
  static async populateWithResource(resource) {
    const Hook = require('../hook/Hook');
    const hooks = await Hook.query();
    const items = [];
    for (let i of hooks) items.push({
      resource_id: resource.id,
      hook_id: i.id,
      active: false
    });
    await ResourceHook.query().insert(items)
  }

  /**
   * Populate with hook
   */
  static async populateWithHook(hook) {
    const Resource = require('../resource/Resource');
    const resources = await Resource.query();
    const items = [];
    for (let i of resources) items.push({
      resource_id: i.id,
      hook_id: hook.id,
      active: false
    });
    await ResourceHook.query().insert(items)
  }
}

module.exports = ResourceHook;

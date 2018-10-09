const pick = require('lodash.pick');
const Model = require('../Model');

class Hook extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'hooks';
  }

  /**
   * Set fillable columns
   */
  static fillable() {
    return [
      'system',
    ];
  }

  /**
   * Filter input
   * @param {Object} input 
   */
  static filterInput(input) {
    return pick(input, Hook.fillable())
  }

  /**
   * Populate relations
   */
  async $afterInsert() {
    const RoleHook = require('../rolehook/RoleHook');
    await RoleHook.populateWithHook(this)
    await Hook.populateResources(this);
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['system'],
      properties: {
        system: { type: 'string', minLength: 3, maxLength: 255 }
      }
    }
  };

  /**
   * Populate hooks
   */
  static async populateResources(hook) {
    const Resource = require('../resource/Resource');
    const resources = await Resource.query();
    const items = [];
    for (let i = 0; i < resources.length; i++) items.push({
      resource_id: resources[i].id,
      hook_id: hook[i].id,
      order: i+1
    });
    await Resource.knex().table('resource_hooks').insert(items);
  }
}

module.exports = Hook;

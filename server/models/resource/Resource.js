const pick = require('lodash.pick');
const Model = require('../Model');
const Hook = require('../hook/Hook');

class Resource extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'resources';
  }

  /**
   * Set fillable columns
   */
  static fillable() {
    return [
      'system',
      'resolver'
    ];
  }

  /**
   * Filter input
   * @param {Object} input 
   */
  static filterInput(input) {
    return pick(input, Resource.fillable())
  }

  /**
   * Populate relations
   */
  async $afterInsert() {
    const Permission = require('../permission/Permission');
    await Permission.populateWithResource(this);
    await Resource.populateHooks(this)
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['system', 'resolver'],
      properties: {
        system: { type: 'string', minLength: 3, maxLength: 255 },
        resolver: { type: 'string', minLength: 3, maxLength: 255 }
      }
    }
  };

  /**
   * ORM relations mapping
   */
  static get relationMappings() {
    return {
      hooks: {
        relation: Model.ManyToManyRelation,
        modelClass: Hook,
        join: {
          from: 'resources.id',
          through: {
            from: 'resource_hooks.resource_id',
            to: 'resource_hooks.hook_id'
          },
          to: 'hooks.id'
        }
      }
    }
  }

  /**
   * Populate hooks
   */
  static async populateHooks(resource) {
    const Hook = require('../hook/Hook');
    const hooks = await Hook.query();
    const items = [];
    for (let i = 0; i < hooks.length; i++) items.push({
      resource_id: resource.id,
      hook_id: hooks[i].id,
      order: i+1
    });
    await Resource.knex().table('resource_hooks').insert(items);
  }
}

module.exports = Resource;

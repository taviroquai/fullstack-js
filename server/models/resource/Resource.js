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
}

module.exports = Resource;

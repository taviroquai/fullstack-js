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
    const ResourceHook = require('../resourcehook/ResourceHook');
    await ResourceHook.populateWithHook(this);
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
  }
}

module.exports = Hook;

const Model = require('../Model');
const Resource = require('../resource/Resource');

class Hook extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'hooks';
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
}

module.exports = Hook;

const pick = require('lodash.pick');
const Model = use('core/Model');

class Role extends Model {

  /**
   * Set database table name
   */
  static get tableName() {
    return 'roles';
  }

  /**
   * Populate relations
   */
  async $afterInsert() {
    const Permission = use('permission/Permission');
    await Permission.populateWithRole(this);
    const RoleUser = use('roleuser/RoleUser');
    await RoleUser.populateWithRole(this)
    const RoleHook = use('rolehook/RoleHook');
    await RoleHook.populateWithRole(this)
  }

  /**
   * Set fillable columns
   */
  static fillable() {
    return [
      'label',
      'system',
    ];
  }

  /**
   * Filter input
   * @param {Object} input
   */
  static filterInput(input) {
    return pick(input, Role.fillable())
  }

  /**
   * Set validation schema
   */
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['label', 'system'],
      properties: {
        label: { type: 'string', minLength: 3, maxLength: 255 },
        system: { type: 'string', minLength: 3, maxLength: 255 }
      }
    }
  };

}

module.exports = Role;

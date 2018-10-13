const RoleUser = require('../../modules/06_roleuser/RoleUser');
const errors = require('../../core/errors.json');

/**
 * Check whether there is a user in state or not
 *
 * @param {Object} ctx
 * @param {String} type
 * @param {String} action
 * @param {Object} args
 */
const hook = async (ctx, type, action, args) => {
  const { user } = ctx.state;

  // Get superuser roles
  const result = await RoleUser.query()
    .join('roles', 'role_users.role_id', 'roles.id')
    .where('user_id', user.id)
    .where('system', 'SUPERUSER')
    .where('active', true)
    .count();

  // Check only superuser
  if (parseInt(result[0].count, 10) < 1) throw new Error(errors['001']);
  return args;
}

module.exports = hook;

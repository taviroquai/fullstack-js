const RoleUser = require('../../modules/roleuser/RoleUser');
const errors = require('../../core/errors.json');

/**
 * Check whether the requesting user is the avatar owner or not
 *
 * @param {Object} ctx
 * @param {String} type
 * @param {String} action
 * @param {Object} args
 */
const hook = async (ctx, resource, args) => {
  const { user } = ctx.state;
  if (user && (user.id !== parseInt(args.id, 10))) throw new Error(errors['001']);
  return args;
}

module.exports = hook;

const UserModel = require('../../modules/user/User');
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
  const owner = await UserModel.query().findOne({ id: args.id });
  if (user && owner && (user.id !== owner.id)) throw new Error(errors['001']);
  return args;
}

module.exports = hook;

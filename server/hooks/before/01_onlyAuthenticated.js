const errors = use('core/errors.json');

/**
 * Check whether there is a user in state
 * or not
 *
 * @param {Object} ctx
 * @param {String} resource
 * @param {Object} args
 */
const hook = async (ctx, resource, args) => {
  const { user } = ctx.state;
  if (!user) throw new Error(errors['043']);
  return args;
}

module.exports = hook;

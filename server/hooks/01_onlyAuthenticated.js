const errors = require('../errors.json');

/**
 * Check whether there is a user in state
 * or not
 *
 * @param {Object} ctx
 * @param {String} type
 * @param {String} action
 * @param {Object} args
 */
const hook = async (ctx, type, action, args) => {
  const { user } = ctx.state;
  if (!user) throw new Error(errors['043']);
  return args;
}

module.exports = hook;

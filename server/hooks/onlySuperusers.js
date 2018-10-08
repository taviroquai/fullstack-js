const Role = require('../models/user/Role');

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
  const role = await Role.query().findById(user.role_id);
  if (role.system !== 'SUPERUSER') throw new Error('Access denied');
}

module.exports = hook;
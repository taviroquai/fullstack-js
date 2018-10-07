const User = require('../models/user/User');

/**
 * Check whether there is a user in state or not
 * 
 * @param {Object} ctx
 * @param {String} type 
 * @param {String} action 
 * @param {Object} args 
 */
const isAuthenticated = async (ctx, type, action, args) => {
  const { user } = ctx.state;
  if (!user) throw new Error('User not authenticated');
}

module.exports = isAuthenticated;
const User = require('../models/user/User');

/**
 * Parse JWT from HTTP headers
 * 
 * @param {Object} header 
 */
const parseJwtHeader = (header) => {
  let token = '';
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  return token;
}

/**
 * Check whether JWT is valid
 * 
 * @param {Object} request 
 * @param {String} type 
 * @param {String} action 
 * @param {Object} args 
 */
const isAuthenticated = async ({ header }, type, action, args) => {
  const authtoken = parseJwtHeader(header);
  const user = await User.query().findOne({ authtoken })
  if (!user) throw new Error('User not authenticated');
}

module.exports = isAuthenticated;
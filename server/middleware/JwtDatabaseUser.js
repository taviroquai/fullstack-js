const jwt = require('jsonwebtoken');
const User = require('../modules/user/User');
const authSecret = process.env.FSTACK_AUTH_SECRET;

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
 * Load user into request if found
 *
 * @param {Object} ctx
 */
const middleware = async (ctx, next) => {
  const jwttoken = parseJwtHeader(ctx.request.header);
  const user = await User.getUserFromJwt(jwttoken);
  ctx.state['user'] = user;
  return await next();
}

module.exports = middleware;

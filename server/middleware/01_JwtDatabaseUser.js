const User = require('../modules/05_user/User');

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

module.exports = middleware;

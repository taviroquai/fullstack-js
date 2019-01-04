const User = require('../../modules/enabled/user/User');

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
 * Inversion of control
 * Apply middleware
 * 
 * @param {Object} app The Koa application 
 */
const use = (app) => {
  app.use(middleware);
}

/**
 * Parse JWT from HTTP headers
 *
 * @param {Object} header
 */
const parseJwtHeader = (header) => {
  const token = (header.authorization || '')
    .replace('Bearer', '')
    .trim();
  return token;
}

module.exports = use;

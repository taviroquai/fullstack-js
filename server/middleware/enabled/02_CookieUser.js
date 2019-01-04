const User = require('../../modules/enabled/user/User');

/**
 * Load user into request if found
 *
 * @param {Object} ctx
 */
const middleware = async (ctx, next) => {
  if (ctx.state['user']) return await next();
  const jwttoken = parseJwtFromCookieHeader(ctx.request.header);
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
const parseJwtFromCookieHeader = (header) => {
  const regex = new RegExp("user=\{(.*)\}", "gi");
  const result = regex.exec(decodeURIComponent(header['cookie']));
  if (!result) return '';
  const user = JSON.parse('{' + result[1] + '}');
  return user.authtoken;
}

module.exports = use;

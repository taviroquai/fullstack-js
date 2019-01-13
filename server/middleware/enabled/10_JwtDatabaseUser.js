const userDir = process.env.FSTACK_MODULE_USER;
const UserModel = use(userDir+'/User');

/**
 * Load user into request if found
 *
 * @param {Object} ctx
 */
const middleware = async (ctx, next) => {
  const jwttoken = parseJwtHeader(ctx.request.header);
  const user = await UserModel.getUserFromJwt(jwttoken);
  ctx.state['user'] = user;
  return await next();
}

/**
 * Inversion of control
 * Apply middleware
 * 
 * @param {Object} app The Koa application 
 */
const load = (app) => {
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

module.exports = load;

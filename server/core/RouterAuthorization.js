const Authorization = require('./Authorization');
const Router = require('koa-router');
const errors = require('../core/errors.json');
const User = require('../modules/user/User');

/**
 * Router authorization
 */
class RouterAuthorization {

  /**
   * Creates an authorization router and adds nested modules routes
   * 
   * @param {Object} modulesRouter 
   */
  static getRouter(modulesRouter) {
    const router = new Router();
    const { stack } = modulesRouter.routes().router;
    stack.map(layer => {
      router.all(layer.path, async (ctx, next) => {
        try {
          await RouterAuthorization.authorize(ctx, layer.path, next);
        } catch (error) {
          if (error === 'ERROR_ACCESS_DENIED') {
            ctx.status = 401;
          } else {
            throw error;
          }
        }
      });
    });
    router.use('', modulesRouter.routes(), modulesRouter.allowedMethods());
    return router;
  }

  /**
   * Wraps the next around authorization resolver
   * 
   * @param {String} type 
   * @param {String} name 
   * @param {Function} resolver 
   */
  static async authorize(ctx, resource, next) {

    // Check permissions
    const user = ctx.state.user;
    const roles = await User.getRoles(user);
    const denied = await Authorization.getAccessDenied(roles, resource);
    
    // Debug message
    if (process.env.FSTACK_DEBUG) console.log(
      'Authorize?',
      user ? user.username : user,
      roles.map(r => r.role.system).join(','),
      resource,
      !denied,
      '(' + ctx.request.ip + ')'
    );

    // Access denied
    if (!!denied) throw new Error(errors['001']);

    // Wrap hooks in sequence (before and after)
    let args = ctx.params;
    args = await Authorization.runHooks(roles, resource, 'before', {ctx}, args);
    await next();
    await Authorization.runHooks(roles, resource, 'after', {ctx}, {});
  }
}

module.exports = RouterAuthorization;

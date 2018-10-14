const fs = require('fs');
const Router = require('koa-router');
const errors = require('../core/errors.json');
const User = require('../modules/user/User');

/**
 * Router authorization
 * TODO: extract common functions to a Authorization class
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
          console.log(error.message);
          if (error === 'ERROR_ACCESS_DENIED') {
            ctx.status = 401;
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
    const denied = await RouterAuthorization.getAccessDenied(roles, resource);
    
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
    args = await RouterAuthorization.runHooks(roles, resource, 'before', {ctx}, args);
    await next();
    await RouterAuthorization.runHooks(roles, resource, 'after', {ctx}, {});
  }

    /**
   * Get cached authorization filename
   * 
   * @param {String} name 
   */
  static getCacheFilename(name) {
    return (process.env.FSTACK_CACHE_PATH || "./cache")
      + '/' + name + '.json';
  }

  /**
   * Resolve resource/roles access
   * 
   * @param {Array} roles 
   * @param {String} resource 
   */
  static async getAccessDenied(roles, resource) {
    const roleIds = roles.map(r => r.role_id);
    const permissions = JSON.parse(fs.readFileSync(RouterAuthorization.getCacheFilename('permissions')));
    const access = permissions.reduce((access, p) => {
      if (p.resource === resource && roleIds.indexOf(p.role_id) > -1) {
        access = access && p.access;
      }
      return access;
    }, true);
    return !access;
  }

  /**
   * Load hooks and run them
   * 
   * @param {Array} roles 
   * @param {String} resource 
   * @param {String} hookType 
   * @param {Object} context 
   * @param {Object} data 
   */
  static async runHooks(roles, resource, hookType, context, data) {
    const roleIds = roles.map(r => r.role_id);
    const rolehooks = JSON.parse(fs.readFileSync(RouterAuthorization.getCacheFilename('rolehooks')));
    let hooksConfig = RouterAuthorization.getResourceHooks(resource, hookType);
    for (let k of hooksConfig) {

      // Find role hook bypass
      const bypass = RouterAuthorization.getHookBypass(roleIds, rolehooks, k.hook);
      if (process.env.FSTACK_DEBUG) console.log('Bypass:', hookType, k.hook, !!bypass);
      if (!bypass) {
        const hook = require('../hooks/' + hookType + '/' + k.hook);
        data = await hook(context.ctx, resource, data);
      }
    }
    return data;
  }

  /**
   * Get resource hooks
   * 
   * @param {String} resource
   * @param {String} hookType
   */
  static getResourceHooks(resource, hookType) {
    let hooks = JSON.parse(fs.readFileSync(RouterAuthorization.getCacheFilename('resourcehooks')));
    hooks = hooks.filter(h => {
      return h.resource === resource && h.active === true && h.type === hookType;
    });
    return hooks;
  }

  /**
   * Get hook bypass for user roles
   * 
   * @param {Array} roleIds
   * @param {Array} rolehooks 
   */
  static getHookBypass(roleIds, rolehooks, hook) {
    const bypass = rolehooks.reduce((bypass, h) => {
      if (h.hook === hook && roleIds.indexOf(h.role_id) > -1) {
        bypass = bypass && h.bypass;
      }
      return bypass;
    }, true);
    return bypass;
  }
}

module.exports = RouterAuthorization;

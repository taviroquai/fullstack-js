const fs = require('fs');
const errors = require('../core/errors.json');
const User = require('../modules/user/User');
const RoleHook = require('../modules/rolehook/RoleHook');
const Permission = require('../modules/permission/Permission');
const ResourceHook = require('../modules/resourcehook/ResourceHook');

/**
 * Graphql authorization
 */
class GraphqlAuthorization {

  /**
   * Wraps the resolver around authorization resolver
   * 
   * @param {String} resource
   * @param {Function} resolver 
   */
  static authorize(resource, resolver) {
    const fn = async (root, args, context) => {

      // Check permissions
      const user = context.ctx.state.user;
      const roles = await User.getRoles(user);
      const denied = await GraphqlAuthorization.getAccessDenied(roles, resource);
      
      // Debug message
      if (process.env.FSTACK_DEBUG) console.log(
        'Authorize?',
        user ? user.username : user,
        roles.map(r => r.role.system).join(','),
        resource,
        !denied,
        '(' + context.ctx.request.ip + ')'
      );

      // Access denied
      if (!!denied) throw new Error(errors['001']);

      // Wrap hooks in sequence (before and after)
      args = await GraphqlAuthorization.runHooks(roles, resource, 'before', context, args);
      let data = await resolver(root, args, context);
      data = await GraphqlAuthorization.runHooks(roles, resource, 'after', context, data);
      return data;
    }
    return fn;
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
   * Update all authorization cache files
   */
  static async updateCache() {
    let filename = '';

    // Update permissions
    const permissions = await Permission.query()
      .select('role_id', 'resource', 'access');
    filename = GraphqlAuthorization.getCacheFilename('permissions');
    fs.writeFileSync(filename, JSON.stringify(permissions, null, 2), 'utf-8');
    
    // Update resource hooks
    const resourcehooks = await ResourceHook.query()
      .select('resource', 'hook', 'active', 'type')
      .orderBy('order');
    filename = GraphqlAuthorization.getCacheFilename('resourcehooks');
    fs.writeFileSync(filename, JSON.stringify(resourcehooks, null, 2), 'utf-8');

    // Update role hooks
    const rolehooks = await RoleHook.query()
      .select('role_id', 'hook', 'bypass');
    filename = GraphqlAuthorization.getCacheFilename('rolehooks');
    fs.writeFileSync(filename, JSON.stringify(rolehooks, null, 2), 'utf-8');
  }

  /**
   * Resolve resource/roles access
   * 
   * @param {Array} roles 
   * @param {String} resource 
   */
  static async getAccessDenied(roles, resource) {
    const roleIds = roles.map(r => r.role_id);
    const permissions = JSON.parse(fs.readFileSync(GraphqlAuthorization.getCacheFilename('permissions')));
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
    const rolehooks = JSON.parse(fs.readFileSync(GraphqlAuthorization.getCacheFilename('rolehooks')));
    let hooksConfig = GraphqlAuthorization.getResourceHooks(resource, hookType);
    for (let k of hooksConfig) {

      // Find role hook bypass
      const bypass = GraphqlAuthorization.getHookBypass(roleIds, rolehooks, k.hook);
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
    let hooks = JSON.parse(fs.readFileSync(GraphqlAuthorization.getCacheFilename('resourcehooks')));
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

module.exports = GraphqlAuthorization;

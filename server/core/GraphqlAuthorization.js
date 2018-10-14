const fs = require('fs');
const errors = require('../core/errors.json');
const ModuleManager = require('../core/ModuleManager');
const RoleHook = require('../modules/rolehook/RoleHook');
const RoleUser = require('../modules/roleuser/RoleUser');
const Permission = require('../modules/permission/Permission');
const ResourceHook = require('../modules/resourcehook/ResourceHook');

/**
 * Graphql authorization
 * TODO: cache permissions instead of check from database in every request
 */
class GraphqlAuthorization {

  /*
   * Inject permissions for resolver
   */
  static authorize(type, name, resolver) {
    const fn = async (root, args, context) => {

      // Check permissions
      const user = context.ctx.state.user;
      const roles = await GraphqlAuthorization.getRolesFromUser(user);
      const resource = type + '.' + name;
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
      args = await GraphqlAuthorization.runHooks(roles, resource, 'before', context, type, name, args);
      let data = await resolver(root, args, context);
      data = await GraphqlAuthorization.runHooks(roles, resource, 'after', context, type, name, data);
      return data;
    }
    return fn;
  }

  /**
   * Get cached filename
   * @param {String} name 
   */
  static getCacheFilename(name) {
    return (process.env.FSTACK_CACHE_PATH || "./cache")
      + '/' + name + '.json';
  }

  /**
   * Update authorization cache
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
   * Get user roles
   */
  static async getRolesFromUser(user) {
    let roles = [];
    if (!user) {
      roles = await RoleUser
        .query()
        .eager('role')
        .where('role_id', '1');
    } else {
      roles = await RoleUser
        .query()
        .eager('role')
        .where('user_id', user.id)
        .where('active', true);
    }
    return roles;
  }

  /*
   * Get access denied
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

  /*
   * Run hooks for roles and resource
   */
  static async runHooks(roles, resource, hookType, context, type, name, data) {
    const roleIds = roles.map(r => r.role_id);
    const rolehooks = JSON.parse(fs.readFileSync(GraphqlAuthorization.getCacheFilename('rolehooks')));
    let hooksConfig = GraphqlAuthorization.getResourceHooks(resource, hookType);
    for (let k of hooksConfig) {

      // Find role hook bypass
      const bypass = GraphqlAuthorization.getHookBypass(roleIds, rolehooks, k.hook);
      if (process.env.FSTACK_DEBUG) console.log('Bypass:', hookType, k.hook, !!bypass);
      if (!bypass) {
        const hook = require('../hooks/' + hookType + '/' + k.hook);
        data = await hook(context.ctx, type, name, data);
      }
    }
    return data;
  }

  /**
   * Get resource hooks
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

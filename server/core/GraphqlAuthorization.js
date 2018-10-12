const errors = require('../core/errors.json');
const ModuleManager = require('../core/ModuleManager');
const RoleHook = require('../modules/07_rolehook/RoleHook');
const RoleUser = require('../modules/06_roleuser/RoleUser');
const Permission = require('../modules/04_permission/Permission');
const ResourceHook = require('../modules/02_resourcehook/ResourceHook');

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
      const denied = resource ? await GraphqlAuthorization.getAccessDenied(roles, resource) : false;
      
      // Debug authorization message
      if (process.env.FSTACK_DEBUG) console.log(
        'Authorization:',
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
    const denied = await Permission
      .query()
      .whereIn('role_id', roles.map(r => r.role_id))
      .where('resource', resource)
      .where('access', false)
      .first();
    return denied;
  }

  /*
   * Run before hooks
   */
  static async runHooks(roles, resource, hookType, context, type, name, data) {
    if (resource) {
      const before = await ResourceHook.query()
        .where('resource', resource)
        .where('active', true)
        .where('type', hookType)
        .orderBy('order');
      for (let k of before) {

        // Find hooks bypass
        const bypass = await RoleHook.query()
          .whereIn('role_id', roles.map(r => r.role_id))
          .where('hook', k.hook)
          .where('bypass', true)
          .first();
        if (process.env.FSTACK_DEBUG) console.log('Bypass:', hookType, k.hook, !!bypass);
        if (!bypass) {
          const hooks = GraphqlAuthorization.loadHooks();
          if (hooks[k.hook]) {
            data = await hooks[k.hook](context.ctx, type, name, data);
          }
        }
      }
    }
    return data;
  }

  /**
   * Load hooks
   */
  static loadHooks() {
    const hooksList = ModuleManager.getHooksNames();
    const hooks = {};
    for (let name of hooksList) {
      hooks[name] = require('../hooks/' + name);
    }
    return hooks;
  }
}

module.exports = GraphqlAuthorization;

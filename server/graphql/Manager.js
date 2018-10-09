const RoleUser = require('../models/roleuser/RoleUser');
const Resource = require('../models/resource/Resource');
const Permission = require('../models/permission/Permission');
const ResourceHook = require('../models/resourcehook/ResourceHook');
const RoleHook = require('../models/rolehook/RoleHook');
const { gql } = require('apollo-server-koa');
const HooksAvailable = require('../hooks');
const Types = require('../models/types');
const combinedResolvers = require('../models/resolvers');
const schema = require('./schema');

/**
 * Graphql configuration manager
 *
 * Builds the type definitions and resolvers with hooks
 * Configuration is loaded from database
 *
 * TODO: Refactor all of this!
 * TODO: cache permissions instead of check from database in every request
 */
class Manager {

  /**
   * Composes complete type definitions schema + models
   */
  static getTypeDefs() {
    let definitions = schema;
    Object.keys(Types).map(key => definitions += Types[key]);
    const typeDefs = gql`${definitions}`;
    return typeDefs;
  }

  /**
   * Composes complete resolvers object from models and
   * adds permissions and hooks configuration
   */
  static getResolvers() {
    const finalResolvers = {};
    Object.keys(combinedResolvers).map(type => {
      finalResolvers[type] = finalResolvers[type] || {};
      Object.keys(combinedResolvers[type]).map(name => {
        const resolver = combinedResolvers[type][name];
        finalResolvers[type][name] = Manager.wrapPermissions(type, name, resolver);
      });
    });

    // Return final resolvers object
    return finalResolvers;
  }

  /*
   * Inject permissions for resolver
   */
  static wrapPermissions(type, name, resolver) {
    const fn = async (root, args, context) => {

      // Check permissions
      const user = context.ctx.state.user;
      const roles = await Manager.getRolesFromUser(user);
      const resource = await Manager.getResourceFromTypeName(type, name);
      const denied = resource ? await Manager.getAccessDenied(roles, resource) : false;
      if (!!denied) throw new Error('Access denied');

      // Wrap hooks in sequence (before and after)
      args = await Manager.runHooks(roles, resource, 'before', context, type, name, args);
      let data = await resolver(root, args, context);
      data = await Manager.runHooks(roles, resource, 'after', context, type, name, data);
      return data;
    }
    return fn;
  }

  /**
   * Get user roles
   */
  static async getRolesFromUser(user) {
    console.log('\nrequest by user:', user ? user.username : user);
    let roles = [];
    if (!user) roles = await RoleUser.query().eager('role').where('role_id', '1');
    else roles = await RoleUser.query().eager('role').where('user_id', user.id).where('active', true);
    console.log('roles:', roles.map(r => r.role.system).join(','));
    return roles;
  }

  /*
   * Get resource from resolver type and name
   */
  static async getResourceFromTypeName(type, name) {
    const resource = await Resource.query().where('system', type+'.'+name).first();
    console.log('Found registered resource:', resource ? resource.system : 'none');
    return resource;
  }

  /*
   * Get access denied
   */
  static async getAccessDenied(roles, resource) {
    const denied = await Permission.query()
      .whereIn('role_id', roles.map(r => r.role_id))
      .where('resource_id', resource.id)
      .where('access', false)
      .first();
    console.log('access denied:', !!denied);
    return denied;
  }

  /*
   * Run before hooks
   */
  static async runHooks(roles, resource, hookType, context, type, name, data) {
    if (resource) {
      const before = await ResourceHook.query()
        .eager('hook')
        .where('resource_id', resource.id)
        .where('active', true)
        .where('type', hookType)
        .orderBy('order');
      for (let k of before) {

        // Find hooks bypass
        const bypass = await RoleHook.query()
          .whereIn('role_id', roles.map(r => r.role_id))
          .where('hook_id', k.hook.id)
          .where('bypass', true)
          .first();
        console.log('bypass before ' + k.hook.system + ':', !!bypass);
        if (!bypass) {
          if (HooksAvailable[k.hook.system]) {
            data = await HooksAvailable[k.hook.system](context.ctx, type, name, data);
          }
        }
      }
    }
    return data;
  }
}

module.exports = Manager;

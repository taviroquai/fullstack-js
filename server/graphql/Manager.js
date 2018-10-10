const RoleUser = require('../modules/roleuser/RoleUser');
const Resource = require('../modules/resource/Resource');
const Permission = require('../modules/permission/Permission');
const ResourceHook = require('../modules/resourcehook/ResourceHook');
const RoleHook = require('../modules/rolehook/RoleHook');
const { gql } = require('apollo-server-koa');
const HooksAvailable = require('../hooks');
const merge = require('lodash.merge');
const errors = require('../errors.json');

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
    let queriesCombined = '';
    let mutationsCombined = '';
    let typesCombined = '';
    const modelsList = process.env.FSTACK_MODELS.split(',');
    for (let m of modelsList) {
      queriesCombined += require('../modules/' + m + '/queries');
    }
    for (let m of modelsList) {
      mutationsCombined += require('../modules/' + m + '/mutations');
    }
    for (let m of modelsList) {
      typesCombined += require('../modules/' + m + '/types');
    }
    const t = `

  type Query {
    ${queriesCombined}
  }

  type Mutation {
    ${mutationsCombined}
  }

  ${typesCombined}
`;

    const typeDefs = gql`
      type Query {
        ${queriesCombined}
      }
      type Mutation {
        ${mutationsCombined}
      }
      ${typesCombined}
      `;
    return typeDefs;
  }

  /**
   * Composes complete resolvers object from models and
   * adds permissions and hooks configuration
   */
  static getResolvers() {
    let combinedResolvers = {};
    const modelsList = process.env.FSTACK_MODELS.split(',');
    for (let m of modelsList) {
      let modelResolvers = require('../modules/' + m + '/resolvers');
      combinedResolvers = merge(combinedResolvers, modelResolvers);
    }
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
      console.log(
        'Request:',
        user ? user.username : user,
        roles.map(r => r.role.system).join(','),
        resource ? resource.system : 'none',
        !denied,
        '(' + context.ctx.request.ip + ')'
      );
      if (!!denied) throw new Error(errors['001']);

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
    let roles = [];
    if (!user) roles = await RoleUser.query().eager('role').where('role_id', '1');
    else roles = await RoleUser.query().eager('role').where('user_id', user.id).where('active', true);
    return roles;
  }

  /*
   * Get resource from resolver type and name
   */
  static async getResourceFromTypeName(type, name) {
    const resource = await Resource.query().where('system', type+'.'+name).first();
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
        console.log('Bypass:', hookType, k.hook.system, !!bypass);
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

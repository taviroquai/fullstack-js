const fs = require('fs');
const merge = require('lodash.merge');
const errors = require('../core/errors.json');
const ModuleManager = require('../core/ModuleManager');
const RoleHook = require('../modules/07_rolehook/RoleHook');
const RoleUser = require('../modules/06_roleuser/RoleUser');
const { ApolloServer, gql } = require('apollo-server-koa');
const Permission = require('../modules/04_permission/Permission');
const ResourceHook = require('../modules/02_resourcehook/ResourceHook');

/**
 * Graphql configuration server
 *
 * Builds the type definitions and resolvers with hooks
 *
 * TODO: cache permissions instead of check from database in every request
 */
class GraphqlManager {

  /**
   * Get apollo server
   */
  static getApolloServer() {
    const typeDefs = GraphqlManager.getTypeDefs();
    const resolvers = GraphqlManager.getResolvers();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ ctx }) => ({ ctx }) // Include Koa context!
    });
    return server;
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

  /**
   * Composes complete resolvers object from models and
   * adds permissions and hooks configuration
   */
  static getResolvers() {
    let combinedResolvers = {};
    const modulesList = ModuleManager.getModulesNames();
    for (let m of modulesList) {
      let filePath = './modules/' + m + '/resolvers.js';
      let requirePath = '../modules/' + m + '/resolvers';
      if (fs.existsSync(filePath)) {
        let modelResolvers = require(requirePath);
        combinedResolvers = merge(combinedResolvers, modelResolvers);
      }
    }
    const finalResolvers = {};
    Object.keys(combinedResolvers).map(type => {
      finalResolvers[type] = finalResolvers[type] || {};
      Object.keys(combinedResolvers[type]).map(name => {
        const resolver = combinedResolvers[type][name];

        // Use authorization
        console.log(!!process.env.FSTACK_AUTHORIZATION);
        if (!!process.env.FSTACK_AUTHORIZATION)
          finalResolvers[type][name] = GraphqlManager.getResolverWithAuthorization(type, name, resolver);
        else
          finalResolvers[type][name] = resolver;
        
      });
    });

    // Return final resolvers object
    return finalResolvers;
  }

  /*
   * Inject permissions for resolver
   */
  static getResolverWithAuthorization(type, name, resolver) {
    const fn = async (root, args, context) => {

      // Check permissions
      const user = context.ctx.state.user;
      const roles = await GraphqlManager.getRolesFromUser(user);
      const resource = type + '.' + name;
      const denied = resource ? await GraphqlManager.getAccessDenied(roles, resource) : false;
      if (process.env.FSTACK_DEBUG) console.log(
        'Authorization:',
        user ? user.username : user,
        roles.map(r => r.role.system).join(','),
        resource,
        !denied,
        '(' + context.ctx.request.ip + ')'
      );
      if (!!denied) throw new Error(errors['001']);

      // Wrap hooks in sequence (before and after)
      args = await GraphqlManager.runHooks(roles, resource, 'before', context, type, name, args);
      let data = await resolver(root, args, context);
      data = await GraphqlManager.runHooks(roles, resource, 'after', context, type, name, data);
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
          const hooks = GraphqlManager.loadHooks();
          if (hooks[k.hook]) {
            data = await hooks[k.hook](context.ctx, type, name, data);
          }
        }
      }
    }
    return data;
  }

  /**
   * Composes complete type definitions schema + models
   */
  static getTypeDefs() {
    let queries = '';
    let mutations = '';
    let types = '';
    const modulesList = ModuleManager.getModulesNames();
    for (let m of modulesList) {
      let filename = './modules/' + m + '/gql/queries.gql';
      if (fs.existsSync(filename)) queries += fs.readFileSync(filename)
    }
    for (let m of modulesList) {
      let filename = './modules/' + m + '/gql/mutations.gql';
      if (fs.existsSync(filename)) mutations += fs.readFileSync(filename);
    }
    for (let m of modulesList) {
      let filename = './modules/' + m + '/gql/types.gql';
      if (fs.existsSync(filename)) types += fs.readFileSync(filename);
    }

    // Combine all Graphql partials in one schema
    const schema = `
type Query {
  ${queries}
}

type Mutation {
  ${mutations}
}

${types}
`;

    // Return schema
    if (process.env.FSTACK_DEBUG) console.log(schema);
    return gql`${schema}`;
  }
}

module.exports = GraphqlManager;

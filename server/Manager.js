const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');
const errors = require('./errors.json');
const RoleHook = require('./modules/rolehook/RoleHook');
const RoleUser = require('./modules/roleuser/RoleUser');
const { ApolloServer, gql } = require('apollo-server-koa');
const Permission = require('./modules/permission/Permission');
const ResourceHook = require('./modules/resourcehook/ResourceHook');

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
   * Get modules names
   */
  static getModulesNames() {
    const path = './modules';
    let modules = fs.readdirSync(path)
    .filter(file => {
      return fs.statSync(path+'/'+file).isDirectory();
    });
    return modules;
  }

  /**
   * Load middleware
   */
  static loadMiddleware() {
    const middlewareList = Manager.getMiddlewareNames();
    const middleware = {};
    for (let name of middlewareList) {
      middleware[name] = require('./middleware/' + name);
    }
    return middleware;
  }

  /**
   * Get middleware names
   */
  static getMiddlewareNames() {
    const path = './middleware';
    let names = fs.readdirSync(path)
    .filter(file => {
      return !fs.statSync(path+'/'+file).isDirectory();
    });
    return names;
  }

  /**
   * Load routes
   */
  static loadRoutes() {
    const routes = {};
    const modules = Manager.getModulesNames();
    for (let name of modules) {
      routes[name] = require('./modules/' + name + '/routes');
    }
    return routes;
  }

  /**
   * Get graphql server
   */
  static getGraphqlServer() {
    const typeDefs = Manager.getTypeDefs();
    const resolvers = Manager.getResolvers();
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
    const hooksList = Manager.getHooksNames();
    const hooks = {};
    for (let name of hooksList) {
      hooks[name] = require('./hooks/' + name);
    }
    return hooks;
  }

  /**
   * Composes complete resolvers object from models and
   * adds permissions and hooks configuration
   */
  static getResolvers() {
    let combinedResolvers = {};
    const modulesList = Manager.getModulesNames();
    for (let m of modulesList) {
      let modelResolvers = require('./modules/' + m + '/resolvers');
      combinedResolvers = merge(combinedResolvers, modelResolvers);
    }
    const finalResolvers = {};
    Object.keys(combinedResolvers).map(type => {
      finalResolvers[type] = finalResolvers[type] || {};
      Object.keys(combinedResolvers[type]).map(name => {
        const resolver = combinedResolvers[type][name];
        finalResolvers[type][name] = Manager.getResolverWithAuthorization(type, name, resolver);
      });
    });

    // Return final resolvers object
    return finalResolvers;
  }

  /**
   * Get resources names
   */
  static getResourcesNames() {
    let combinedResolvers = {};
    const modulesList = Manager.getModulesNames();
    for (let m of modulesList) {
      let modelResolvers = require('./modules/' + m + '/resolvers');
      combinedResolvers = merge(combinedResolvers, modelResolvers);
    }
    let resources = [];
    Object.keys(combinedResolvers).map(type => {
      Object.keys(combinedResolvers[type]).map(name => {
        resources.push(type + '.' +name);
      });
    });

    // Return resources
    return resources;
  }

  /**
   * Get hooks names
   */
  static getHooksNames() {
    let hooks = [];
    fs.readdirSync('./hooks').forEach(filename => {
      const regex = new RegExp("\.([^/.]+)$", "ig");
      let result = regex.exec(filename);
      if (result && result[1].toLowerCase() === 'js') {
        hooks.push(filename.replace(/\.[^/.]+$/, ""));
      }
    });
    return hooks;
  }

  /*
   * Inject permissions for resolver
   */
  static getResolverWithAuthorization(type, name, resolver) {
    const fn = async (root, args, context) => {

      // Check permissions
      const user = context.ctx.state.user;
      const roles = await Manager.getRolesFromUser(user);
      const resource = type + '.' + name;
      const denied = resource ? await Manager.getAccessDenied(roles, resource) : false;
      console.log(
        'Request:',
        user ? user.username : user,
        roles.map(r => r.role.system).join(','),
        resource,
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
        console.log('Bypass:', hookType, k.hook, !!bypass);
        if (!bypass) {
          const hooks = Manager.loadHooks();
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
    let queriesCombined = '';
    let mutationsCombined = '';
    let typesCombined = '';
    const modulesList = Manager.getModulesNames();
    for (let m of modulesList) {
      queriesCombined += require('./modules/' + m + '/queries');
    }
    for (let m of modulesList) {
      mutationsCombined += require('./modules/' + m + '/mutations');
    }
    for (let m of modulesList) {
      typesCombined += require('./modules/' + m + '/types');
    }
    const t = `

  type Query {
    ${queriesCombined}
  }

  type Mutation {
    ${mutationsCombined}
  }

  ${typesCombined}`;

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
}

module.exports = Manager;

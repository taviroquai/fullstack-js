const Resource = require('../models/resource/Resource');
const Permission = require('../models/permission/Permission');
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
        finalResolvers[type][name] = async (root, args, context) => {

          // Find resource
          const resource = await Resource.query()
            .where('system', type+'.'+name)
            .first();

          // Find permission
          if (resource) {
            const user = context.ctx.state.user;
            const allowed = await Permission.query()
              .where('role_id', user ? user.role_id : '1')
              .where('resource_id', resource.id)
              .where('access', true)
              .first();
            if (!allowed) throw new Error('Access denied');
          }

          // Run before hooks
          if (resource) {
            const before = await resource
              .$relatedQuery('hooks')
              .where('active', true)
              .where('type', 'before')
              .orderBy('order');
            for (let k of before) {
              if (HooksAvailable[k.system]) {
                await HooksAvailable[k.system](context.ctx, type, name, args);
              }
            }
          }

          // Call resolver
          const resolver = combinedResolvers[type][name];
          let data = await resolver(root, args, context);

          // Run after hooks
          if (resource) {
            const after = await resource
              .$relatedQuery('hooks')
              .where('active', true)
              .where('type', 'after')
              .orderBy('order');
            for (let k of after) {
              if (HooksAvailable[k.system]) {
                data = await HooksAvailable[k.system](context.ctx, type, name, args, data);
              }
            }
          }

          // Return data
          return data;
        }
      });
    });

    // Return final resolvers object
    return finalResolvers;
  }
}

module.exports = Manager;
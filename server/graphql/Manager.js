const Resource = require('../models/resource/Resource');
const { gql } = require('apollo-server-koa');
const HooksAvailable = require('../hooks');
const Types = require('../models/types');
const combinedResolvers = require('../models/resolvers');
const schema = require('./schema');

class Manager {

  static getTypeDefs() {
    let definitions = schema;
    Object.keys(Types).map(key => definitions += Types[key]);
    const typeDefs = gql`${definitions}`;
    return typeDefs;
  }

  static getResolvers() {
    const resolvers = {};
    Object.keys(combinedResolvers).map(type => {
      resolvers[type] = resolvers[type] || {};
      Object.keys(combinedResolvers[type]).map(name => {
        resolvers[type][name] = async (root, args, context) => {

          // Find configuration for resolver
          const resource = await Resource.query()
            .where('system', type+'.'+name)
            .first();

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

          // Run resolver
          let data = await combinedResolvers[type][name](root, args, context);

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
    return resolvers;
  }

  generateStaticConfig() {
    return new Promise((resolve, reject) => {

    }); 
  }
}

module.exports = Manager;
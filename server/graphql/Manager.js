const fs = require('fs');
const find = require('lodash.find');
const { gql } = require('apollo-server-koa');
const Hooks = require('../hooks');
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
          const graphqlConfig = JSON.parse(fs.readFileSync('./config/graphql.json'));
          const config = find(graphqlConfig, { name: type+'.'+name }) || {};
          console.log(config);

          // Add before hooks
          const before = config.before || [];
          for (let k of before) {
            if (Hooks[k]) {
              await Hooks[k](context.ctx, type, name, args);
            }
          }

          // Run resolver
          let data = await combinedResolvers[type][name](root, args, context);

          // Add after hooks
          const after = config.after || [];
          for (let k of after) {
            if (Hooks[k]) {
              data = await Hooks[k](context.ctx, type, name, args, data);
            }
          }

          // Return data
          return data;
        }
      });
    });
    return resolvers;
  }
}

module.exports = Manager;
const fs = require('fs');
const merge = require('lodash.merge');
const ModuleManager = require('../core/ModuleManager');
const { ApolloServer, gql } = require('apollo-server-koa');

/**
 * Graphql configuration server
 * Builds the type definitions and resolvers
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

    // Merge all resolvers
    const finalResolvers = {};

    // Check if authorization is anabled
    const GraphqlAuthorization = !!process.env.FSTACK_AUTHORIZATION ?
      require('./GraphqlAuthorization') : null;

    // Iterate through module resolvers
    Object.keys(combinedResolvers).map(type => {
      finalResolvers[type] = finalResolvers[type] || {};
      Object.keys(combinedResolvers[type]).map(name => {
        const resolver = combinedResolvers[type][name];

        // Use authorization
        if (GraphqlAuthorization)
          finalResolvers[type][name] = GraphqlAuthorization.authorize(type, name, resolver);
        else
          finalResolvers[type][name] = resolver;
        
      });
    });

    // Return final resolvers object
    return finalResolvers;
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

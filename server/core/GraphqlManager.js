const fs = require('fs');
const merge = require('lodash.merge');
const { ApolloServer, gql } = require('apollo-server-koa');
const ModuleManager = use('core/ModuleManager');

/**
 * Graphql configuration server
 * Builds the type definitions and resolvers
 */
class GraphqlManager {

  /**
   * Get apollo server
   */
  static getApolloServer(GraphqlAuthorization) {
    const typeDefs = GraphqlManager.getTypeDefs();
    const resolvers = GraphqlManager.getResolvers(GraphqlAuthorization);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ ctx }) => ({ ctx }) // Include Koa context!
    });
    return server;
  }

  /**
   * Composes complete resolvers object from models
   * and wraps authorization if set
   */
  static getResolvers(GraphqlAuthorization) {
    const MM = ModuleManager;
    let combinedResolvers = {};
    const modulesList = MM.getModulesPaths();
    for (let path of modulesList) {
      let filePath = path + '/resolvers.js';
      let requirePath = '.' + path + '/resolvers';
      if (fs.existsSync(filePath)) {
        let modelResolvers = require(requirePath);
        combinedResolvers = merge(combinedResolvers, modelResolvers);
      }
    }

    // Merge all resolvers
    const finalResolvers = {};

    // Iterate through module resolvers
    Object.keys(combinedResolvers).map(type => {
      finalResolvers[type] = finalResolvers[type] || {};
      Object.keys(combinedResolvers[type]).map(name => {
        const resource = type + '.' + name;
        const resolver = combinedResolvers[type][name];

        // Use authorization
        if (GraphqlAuthorization)
          finalResolvers[type][name] = GraphqlAuthorization.authorize(resource, resolver);
        else
          finalResolvers[type][name] = resolver;
        
      });
    });

    // Return final resolvers object
    return finalResolvers;
  }

  /**
   * Get graphql schema from cache
   */
  static getTypeDefs() {

    // Build cache if does not exists
    const filename = GraphqlManager.getCacheFilename();
    if (!fs.existsSync(filename)) {
      const schema = ModuleManager.generateGraphqlSchema();
      fs.writeFileSync(filename, schema, 'utf-8');
    }

    // Get schema
    const schema = fs.readFileSync(filename);
    return gql`${schema}`;
  }

  /**
   * Get cached filename
   */
  static getCacheFilename() {
    return (process.env.FSTACK_CACHE_PATH || "./cache")
      + '/schema.gql';
  }

  /**
   * Update cache
   */
  static updateCache() {
    const schema = ModuleManager.generateGraphqlSchema();
    const filename = GraphqlManager.getCacheFilename();
    fs.writeFileSync(filename, schema, 'utf-8');
  }
}

module.exports = GraphqlManager;

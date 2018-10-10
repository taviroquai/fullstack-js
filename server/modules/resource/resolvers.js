/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get resource list
     */
    getResources: async (root, args, context) => {
      const Manager = require('../../Manager');
      const results = Manager.getResourcesNames();
      const total = results.length;
      return { total, results };
    }
  }
}

module.exports = resolvers;

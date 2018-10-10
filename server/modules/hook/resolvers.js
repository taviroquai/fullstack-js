/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get resource list
     */
    getResources: async (root, args, context) => {
      const Manager = require('../Manager');
      return Manager.getHooksNames();
    }
  }
}

module.exports = resolvers;

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get resource list
     */
    getResources: async (root, args, context) => {
      const ModuleManager = require('../ModuleManager');
      return ModuleManager.getHooksNames();
    }
  }
}

module.exports = resolvers;

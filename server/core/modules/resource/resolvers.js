const ResourceHook = require('./ResourceHook');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get resource list
     */
    getResources: async (root, args, context) => {
      const ModuleManager = use('core/ModuleManager');
      const results = ModuleManager.getResourcesNames();
      const total = results.length;
      return { total, results };
    },

    /**
     * Get resourcehooks list
     */
    getResourceHooks: async (root, args, context) => {
      const query = ResourceHook.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Filter by resource
      if (args.resource) query.where('resource', args.resource)

      // Filter by hook
      if (args.hook) query.where('hook', args.resource)

      // Filter by active
      if (args.active) query.where('active', args.active)

      // Filter by type
      if (args.type) query.where('type', args.type)

      // Order
      query.orderBy('order')

      // Get results
      const result = await query.page(page, limit);
      return result;
    }
  },

  Mutation: {

    /**
     * Update resourcehook
     */
    updateResourceHook: async (root, args, context) => {
      await ResourceHook.query()
        .patch({ active: args.active })
        .where('id', args.id)
      return true;
    }
  }
}

module.exports = resolvers;

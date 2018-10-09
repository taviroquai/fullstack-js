const ResourceHook = require('./ResourceHook');

// Fetch helper
const getResourceHookById = async (id) => {
  id = parseInt(id, 10);
  const resourcehook = await ResourceHook.query().findById(id);
  return resourcehook;
}

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get resourcehooks list
     */
    getResourceHooks: async (root, args, context) => {
      const query = ResourceHook.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('[resource, hook]');

      // Filter by resource
      if (args.resource_id) query.where('resource_id', args.resource_id)

      // Filter by hook
      if (args.hook_id) query.where('hook_id', args.resource_id)

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

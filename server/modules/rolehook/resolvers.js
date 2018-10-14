const RoleHook = require('./RoleHook');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get rolehooks list
     */
    getRoleHooks: async (root, args, context) => {
      const query = RoleHook.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('role');

      // Filter by role
      if (args.role_id) query.where('role_id', args.role_id)

      // Filter by hook
      if (args.hook) query.where('hook', args.hook)

      // Filter by bypass
      if (args.bypass) query.where('bypass', args.bypass)

      // Order
      query.orderBy('id', 'desc')

      // Get results
      const result = await query.page(page, limit);
      return result;
    }
  },

  Mutation: {

    /**
     * Update rolehook
     */
    updateRoleHook: async (root, args, context) => {
      await RoleHook.query()
        .patch({ bypass: args.bypass })
        .where('id', args.id)
      return true;
    }
  }
}

module.exports = resolvers;

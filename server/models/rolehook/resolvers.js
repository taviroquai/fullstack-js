const RoleHook = require('./RoleHook');

// Fetch helper
const getRoleHookById = async (id) => {
  id = parseInt(id, 10);
  const rolehook = await RoleHook.query().findById(id);
  return rolehook;
}

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
      query.eager('[role, hook]');

      // Filter by role
      if (args.role_id) {
        query.where('role_id', args.role_id)
      }

      // Filter by hook
      if (args.hook_id) {
        query.where('hook_id', args.role_id)
      }

      // Filter by bypass
      if (args.bypass) {
        query.where('bypass', args.bypass)
      }

      // Order
      query.orderBy('id', 'desc')

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get rolehook by id
     */
    getRoleHookById: async (root, args, context) => {
      const rolehook = await getRoleHookById(args.id);
      if (!rolehook) throw new Error('RoleHook not found');
      return rolehook;
    }
  },

  Mutation: {

    /**
     * Create rolehook
     */
    createRoleHook: async (root, args, context) => {
      const rolehook = await RoleHook.query()
        .insert(args)
        .returning('id');
      return await getRoleHookById(rolehook.id);
    },

    /**
     * Update rolehook
     */
    updateRoleHook: async (root, args, context) => {
      if (!args.id) throw new Error('RoleHook must exist');
      await RoleHook.query()
        .update({ bypass: args.bypass })
        .where('id', args.id)
      return await getRoleHookById(args.id);
    }

  }
}

module.exports = resolvers;
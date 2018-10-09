const RoleUser = require('./RoleUser');

// Fetch helper
const getRoleUserkById = async (id) => {
  id = parseInt(id, 10);
  const roleuser = await RoleUser.query().findById(id);
  return roleuser;
}

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get roleusers list
     */
    getRoleUsers: async (root, args, context) => {
      const query = RoleUser.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('[role, user]');

      // Filter by role
      if (args.role_id) query.where('role_id', args.role_id)

      // Filter by user
      if (args.hook_id) query.where('user_id', args.role_id)

      // Filter by bypass
      if (args.active) query.where('active', args.active)

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
    updateRoleUser: async (root, args, context) => {
      await RoleUser.query()
        .patch({ active: args.active })
        .where('id', args.id);
      return true
    }
  }
}

module.exports = resolvers;

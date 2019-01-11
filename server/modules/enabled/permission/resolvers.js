const Permission = use('permission/Permission');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get permissions list
     */
    getPermissions: async (root, args, context) => {
      const query = Permission.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('role');

      // Filter by role
      if (args.role_id) query.where('role_id', args.role_id)

      // Filter by resource
      if (args.resource) query.where('resource', args.resource)

      // Filter by access
      if (args.access) {
        query.where('access', args.access)
      }

      // Order
      query.orderBy('id', 'desc')

      // Get results
      const result = await query.page(page, limit);
      return result;
    }
  },

  Mutation: {

    /**
     * Update permission
     */
    updatePermission: async (root, args, context) => {
      await Permission.query()
        .update({ access: args.access })
        .where('id', args.id)
      return await Permission.query().findById(args.id);
    }

  }
}

module.exports = resolvers;

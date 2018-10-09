const Permission = require('./Permission');

// Fetch helper
const getPermissionById = async (id) => {
  id = parseInt(id, 10);
  const permission = await Permission.query().findById(id);
  return permission;
}

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
      query.eager('[role, resource]');

      // Filter by role
      if (args.role_id) {
        query.where('role_id', args.role_id)
      }

      // Filter by resource
      if (args.resource_id) {
        query.where('resource_id', args.role_id)
      }

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
      if (!args.id) throw new Error('Permission must exist');
      await Permission.query()
        .update({ access: args.access })
        .where('id', args.id)
      return await getPermissionById(args.id);
    }

  }
}

module.exports = resolvers;

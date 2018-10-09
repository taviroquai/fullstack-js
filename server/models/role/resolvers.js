const Role = require('./Role');
const User = require('../user/User');

// Fetch helper
const getRoleById = async (id) => {
  id = parseInt(id, 10);
  const role = await Role.query().findById(id);
  return role;
}

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get roles list
     */
    getRoles: async (root, args, context) => {
      const query = Role.query().eager('users');
      const limit = args.limit || 25;
      const page = args.page || 0;

      // Filter by query
      if (args.query) {
        query.where('label', 'ilike', '%' + args.query + '%')
      }

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get role by id
     */
    getRoleById: async (root, args, context) => {
      const role = await getRoleById(args.id);
      if (!role) throw new Error('Role not found');
      return role;
    },

    /**
     * Get assign users to role
     */
    getRoleUsers: async (root, args, context) => {
      const items = await User.query().where('role_id', args.id);
      return items;
    }
  },

  Mutation: {

    /**
     * Create role
     */
    createRole: async (root, args, context) => {
      const data = Role.filterInput(args);
      const role = await Role.query()
        .insert(data)
        .returning('id');
      return await getRoleById(role.id);
    },

    /**
     * Update role
     */
    updateRole: async (root, args, context) => {
      const data = User.filterInput(args);
      await Role.query()
        .update(data)
        .where('id', args.id)
      return await getRoleById(args.id);
    }

  }
}

module.exports = resolvers;
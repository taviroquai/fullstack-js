const Role = require('./Role');
const errors = require('../../errors.json');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get roles list
     */
    getRoles: async (root, args, context) => {
      const query = Role.query();
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
      const role = await Role.query().findById(args.id);
      if (!role) throw new Error(errors['010']);
      return role;
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
      return await Role.query().findById(role.id);
    },

    /**
     * Update role
     */
    updateRole: async (root, args, context) => {
      const data = Role.filterInput(args);
      await Role.query()
        .update(data)
        .where('id', args.id)
      return await Role.query().findById(args.id);
    }
  }
}

module.exports = resolvers;

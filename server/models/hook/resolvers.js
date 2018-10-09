const Hook = require('./Hook');

// Fetch helper
const getHookById = async (id) => {
  id = parseInt(id, 10);
  const hook = await Hook.query().findById(id);
  return hook;
}

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get hooks list
     */
    getHooks: async (root, args, context) => {
      const query = Hook.query();
      const limit = args.limit || 25;
      const page = args.page || 0;

      // Filter by query
      if (args.query) {
        query.where('system', 'ilike', '%' + args.query + '%')
      }

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get hook by id
     */
    getHookById: async (root, args, context) => {
      const hook = await getHookById(args.id);
      if (!hook) throw new Error('Hook not found');
      return hook;
    }
  },

  Mutation: {

    /**
     * Create hook
     */
    createHook: async (root, args, context) => {
      const hook = await Hook.query()
        .insert(args)
        .returning('id');
      return await getHookById(hook.id);
    },

    /**
     * Update hook
     */
    updateHook: async (root, args, context) => {
      if (!args.id) throw new Error('Hook must exist');
      await Hook.query()
        .update(args)
        .where('id', args.id)
      return await getHookById(args.id);
    }
  }
}

module.exports = resolvers;

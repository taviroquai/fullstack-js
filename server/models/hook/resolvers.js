const Hook = require('./Hook');
const locales = require('../../locales/en/translations.json');

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
      const hook = await Hook.query().findById(args.id);
      if (!hook) throw new Error(locales.error_hook_not_found);
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
      return await Hook.query().findById(hook.id);;
    },

    /**
     * Update hook
     */
    updateHook: async (root, args, context) => {
      await Hook.query()
        .update(args)
        .where('id', args.id)
      return await Hook.query().findById(args.id);
    }
  }
}

module.exports = resolvers;

const Resource = require('./Resource');
const errors = require('../../errors.json');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get resources list
     */
    getResources: async (root, args, context) => {
      const query = Resource.query();
      const limit = args.limit || 25;
      const page = args.page || 0;

      // Filter by query
      if (args.query) {
        query.where('system', 'ilike', '%' + args.query + '%')
      }

      // Order
      query.orderBy('id', 'desc');

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get resource by id
     */
    getResourceById: async (root, args, context) => {
      const resource = await Resource.query().findById(args.id);
      if (!resource) throw new Error(errors['010']);
      return resource;
    }
  },

  Mutation: {

    /**
     * Create resource
     */
    createResource: async (root, args, context) => {
      const data = Resource.filterInput(args);
      const resource = await Resource.query()
        .insert(data)
        .returning('id');
      return await Resource.query().findById(resource.id);
    },

    /**
     * Update resource
     */
    updateResource: async (root, args, context) => {
      const data = Resource.filterInput(args);
      await Resource.query()
        .update(data)
        .where('id', args.id)
      return await Resource.query().findById(args.id);
    }
  }
}

module.exports = resolvers;

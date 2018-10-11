const User = require('./User');
const errors = require('../../errors.json');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get access token
     */
    getAccessToken: async (root, args, context) => {
      const user = await User.query().findOne({ email: args.email });
      if (user) {
        if (!user.active) throw new Error(errors['041']);
        if (!user.verifyPassword(args.password)) throw new Error(errors['042']);
        user.authtoken = await user.regenerateJwt();
        return user;
      }
    },

    /**
     * Get user by access token
     */
    getUserByAccessToken: async (root, args, context) => {
      const user = await User.getUserFromJwt(args.authtoken);
      if (!user) throw new Error(errors['010']);
      return user;
    },

    /**
     * Get all users list
     */
    getUsers: async (root, args, context) => {
      const query = User.query();
      const limit = args.limit || 1;
      const page = args.page ? args.page - 1 : 0;

      // Filter by query
      if (args.query) {
        query.where(builder => {
          builder.where('username', 'ilike', '%' + args.query + '%')
          builder.orWhere('email', 'ilike', '%' + args.query + '%')
        });
      }

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get user by id
     */
    getUserById: async (root, args, context) => {
      const user = await User.query().findById(args.id);
      if (!user) throw new Error(errors['010']);
      return user;
    }
  },

  Mutation: {

    /**
     * Create user
     */
    createUser: async (root, args, context) => {
      User.validateInputEmail(args);
      User.validateInputPasswords(args);
      const data = User.filterInput(args);
      const user = await User.query()
        .insert(data)
        .returning('id');
      return await User.query().findById(user.id);
    },

    /**
     * Update user
     */
    updateUser: async (root, args, context) => {
      User.validateInputEmail(args);
      User.validateInputPasswords(args);
      const data = User.filterInput(args);
      await User.query()
        .update(data)
        .where('id', args.id)
      return await User.query().findById(args.id);
    },

    /**
     * Upload avatar
     *
     * @param {*} root
     * @param {*} args
     */
    uploadAvatar: async (parent, { id, file }) => {
      const { stream, filename, mimetype, encoding } = await file;
      await User.storeAvatar(id, stream, filename, mimetype);
      await User.query().patch({ avatar: filename }).where('id', id);
      return { filename, mimetype, encoding };
    }
  }
}

module.exports = resolvers;

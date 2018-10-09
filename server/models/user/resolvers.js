const User = require('./User');

/**
 * Fetch helper
 */
const getUserById = async (id) => {
  id = parseInt(id, 10);
  const user = await User.query().findById(id);
  return user;
}

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get access token
     */
    getAccessToken: async (root, args, context) => {
      const user = await User.query()
        .findOne({ email: args.email });
      if (user) {
        if (user.active && user.verifyPassword(args.password)) {
          await user.regenerateJwt();
          return user;
        }
        if (!user.active) {
          throw new Error('The account is disabled');
        }
      }
      throw new Error('Invalid credentials');
    },

    /**
     * Get all users list
     */
    getUsers: async (root, args, context) => {
      const query = User.query();
      const limit = args.limit || 25;
      const page = args.page || 0;

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
      const user = await getUserById(args.id);
      if (!user) throw new Error('User not found');
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
      return await getUserById(user.id);
    },

    /**
     * Update user
     */
    updateUser: async (root, args, context) => {
      if (!args.id) throw new Error('User must exist');
      User.validateInputEmail(args);
      User.validateInputPasswords(args);
      const data = User.filterInput(args);
      await User.query()
        .update(data)
        .where('id', args.id)
      return await getUserById(args.id);
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

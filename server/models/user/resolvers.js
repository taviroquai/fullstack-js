const User = require('./User');

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
      return await User.query();
    },

    /**
     * Get user by id
     */
    getUserById: async (root, args, context) => {
      if (!args.id) throw new Error('ID is required');
      const id = parseInt(args.id, 10);
      const user = await User.query().findById(id);
      if (!user) throw new Error('User not found');
      return user;
    }
  },

  Mutation: {

    /**
     * Create user
     */
    createUser: async (root, args, context) => {
      if (!User.validateEmail(args.email)) throw new Error('Invalid email address');
      const user = await User.query()
        .insert(args)
        .returning('id');
      const { getUserById } = resolvers.Query;
      return getUserById(root, user, context);
    },

    /**
     * Update user
     */
    updateUser: async (root, args, context) => {
      if (!args.id) throw new Error('User must exist');
      if (!User.validateEmail(args.email))
        throw new Error('Invalid email address');
      await User.query()
        .update(args)
        .where('id', args.id)
      const { getUserById } = resolvers.Query;
      return getUserById(root, args, context);
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
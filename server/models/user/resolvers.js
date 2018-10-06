const User = require('./User');

const resolvers = {
  Query: {

    /**
     * Get all users list
     */
    getUsers: async (root, args, context) => {
      return await User.query();
    },

    /**
     * Get access token
     */
    getAccessToken: async (root, args, context) => {
      const user = await User.query()
        .findOne({
          username: args.username,
          password: args.password
        });
      if (user) {
        user.regenerateJwt();
        await User.query().update(user).where('id', user.id);
        console.log(args, user);
        return user;
      }
      throw new Error('Invalid credentials');
    }
  }
}

module.exports = resolvers;
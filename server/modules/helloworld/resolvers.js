const HelloWorld = require('./HelloWorld');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Graphql field
     */
    getHello: async (root, args, context) => {
      const name = await HelloWorld.talkTo(args.name);
      return { name };
    }
  }
}

module.exports = resolvers;

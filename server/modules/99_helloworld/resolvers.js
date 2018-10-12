/*
 * You probably will want to load your models here
 */
const HelloWorld = require('./HelloWorld');

/**
 * Graphql resolvers. This is where the action takes place!
 */
const resolvers = {
  Query: {

    /**
     * Get stuff
     */
    getHello: async (root, args, context) => {
      const name = await HelloWorld.talkTo(args.name);
      return { name };
    }
  },

  Mutation: {

    /**
     * Change stuff
     */
    setHello: async (root, args, context) => {
      const name = await HelloWorld.talkTo(args.name);
      return { name };
    }
  }
}

module.exports = resolvers;

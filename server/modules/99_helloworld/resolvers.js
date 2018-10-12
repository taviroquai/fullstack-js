const HelloWorld = require('./HelloWorld');

const resolvers = {
  Query: {
    getHello: async (root, args, context) => {
      const name = await HelloWorld.talkTo(args.name);
      return { name };
    }
  },
  Mutation: {
    setHello: async (root, args, context) => {
      const name = await HelloWorld.talkTo(args.name);
      return { name };
    }
  }
}
module.exports = resolvers;

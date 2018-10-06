const { ApolloServer, gql } = require('apollo-server-koa');
const Types = require('../models/types');
const combinedResolvers = require('../models/resolvers');
const Hooks = require('../hooks');
const config = require('./config');
const schema = require('./schema');

// Combine schemas
let definitions = schema;
Object.keys(Types).map(key => definitions += Types[key]);
const typeDefs = gql`${definitions}`;

// Compile resolvers from configuration
const resolvers = {};
config.map(item => {
  resolvers[item.type] = resolvers[item.type] || {};
  item.paths.map(path => {
    resolvers[item.type][path.name] = async (root, args, context) => {

      // Convenient aliases
      const request = context.ctx.request;
      const type = item.type;
      const name = path.name;

      // Add before hooks
      const before = path.before || [];
      for (let k of before) {
        if (Hooks[k]) {
          await Hooks[k](request, type, name, args);
        }
      }

      // Run resolver
      let data = await combinedResolvers[type][name](root, args, context);

      // Add after hooks
      const after = path.after || [];
      for (let k of after) {
        if (Hooks[k]) {
          data = await Hooks[k](request, type, name, args, data);
        }
      }

      // Return data
      return data;
    }
  });
});

// Create server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ ctx }) => ({ ctx })
});
module.exports = server;
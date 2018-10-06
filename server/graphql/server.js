const { ApolloServer, gql } = require('apollo-server-koa');
const Types = require('../models/types');
const combinedResolvers = require('../models/resolvers');
const Hooks = require('../hooks');
const config = require('./config');
const schema = require('./schema');
console.log(Hooks);

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

      // Add before hooks
      const before = path.before || [];
      for (let k of before) {
        if (Hooks[k]) {
          await Hooks[k](context.ctx.request, item.type, path.name, args);
        }
      }

      // Run resolver
      const data = await combinedResolvers[item.type][path.name](root, args, context);

      // TODO: add after hooks
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
const { ApolloServer } = require('apollo-server-koa');
const Manager = require('./Manager');

// Get combined type definitions
const typeDefs = Manager.getTypeDefs();

// Get resolvers with hooks
const resolvers = Manager.getResolvers();

// Create server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ ctx }) => ({ ctx }) // Include Koa context!
});
module.exports = server;
const GraphqlManager = require('../../core/GraphqlManager');

/**
 * Inversion of control
 * Apply middleware
 * 
 * @param {Object} app The Koa application 
 */
const use = (app) => {
  const apolloServer = GraphqlManager.getApolloServer();
  apolloServer.applyMiddleware({ app });
}

module.exports = use;

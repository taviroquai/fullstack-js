const GraphqlManager = use('core/GraphqlManager');

/**
 * Inversion of control
 * Apply middleware
 * 
 * @param {Object} app The Koa application 
 */
const load = (app) => {
  const apolloServer = GraphqlManager.getApolloServer();
  apolloServer.applyMiddleware({ app });
}

module.exports = load;

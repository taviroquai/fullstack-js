const GraphqlManager = use('core/GraphqlManager');

/**
 * Inversion of control
 * Apply middleware
 * 
 * @param {Object} app The Koa application 
 */
const load = (app) => {

  // Load Graphql authorization adapter
  Authorization = process.env.FSTACK_AUTHORIZATION_GRAPHQL ?
    use(process.env.FSTACK_AUTHORIZATION_GRAPHQL)
    : false;

  const apolloServer = GraphqlManager.getApolloServer(Authorization);
  apolloServer.applyMiddleware({ app });
}

module.exports = load;

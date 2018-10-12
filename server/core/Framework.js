// Load enviroment variables
require('dotenv').config();

// Require dependencies
const Koa = require('koa');
const Router = require('koa-router');
const ModuleManager = require('./ModuleManager');
const GraphqlManager = require('./GraphqlManager');

/**
 * Framework
 */
class Framework {

  /**
   * Init services
   */
  constructor() {
    this.httpServer = new Koa();
    this.port = parseInt(process.env.FSTACK_HTTP_PORT || 4000, 10);
    this.middleware = ModuleManager.loadMiddleware();
    this.apolloServer = GraphqlManager.getApolloServer();
    this.router = new Router();

    return {
      addMiddleware: () => {
        this.addMiddleware();
      },
      addRoutes: () => {
        this.addRoutes();
      },
      start: () => {
        this.start();
      }
    }
  }

  /**
   * Add middleware
   */
  addMiddleware() {
    for (let name in this.middleware) this.httpServer.use(this.middleware[name]);
    this.apolloServer.applyMiddleware({ app: this.httpServer });
  }

  /**
   * Apply module routes
   */
  addRoutes() {
    const routes = ModuleManager.loadRoutes();
    for (let name in routes) routes[name](this.httpServer, this.router);
    this.httpServer.use(this.router.routes()).use(this.router.allowedMethods());
  }

  /**
   * Start HTTP server
   */
  start() {
    this.httpServer.listen({ port: this.port }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${this.apolloServer.graphqlPath}`),
    );
  }
}

module.exports = Framework

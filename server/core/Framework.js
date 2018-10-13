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
  constructor(router, middleware, apolloServer) {
    this.httpServer = new Koa();
    this.port = parseInt(process.env.FSTACK_HTTP_PORT || 4000, 10);
    this.middleware = middleware;
    this.apolloServer = apolloServer;
    this.router = router;

    // Protect private props/functions
    const api = Object.freeze({
      addMiddleware: () => {
        this.addMiddleware();
      },
      addRoutes: () => {
        this.addRoutes();
      },
      start: () => {
        this.start();
      }
    });

    // Only public methods
    return api;
  }

  /**
   * Add middleware
   */
  addMiddleware() {
    if (!this.middleware) this.middleware = ModuleManager.loadMiddleware();
    for (let name in this.middleware) this.httpServer.use(this.middleware[name]);
    if (!this.apolloServer) this.apolloServer = GraphqlManager.getApolloServer();
    this.apolloServer.applyMiddleware({ app: this.httpServer });
  }

  /**
   * Apply module routes
   */
  addRoutes() {
    if (!this.router) this.router = new Router();
    const routes = ModuleManager.loadRoutes();
    for (let name in routes) routes[name](this.httpServer, this.router);
    this.httpServer.use(this.router.routes()).use(this.router.allowedMethods());
  }

  /**
   * Start HTTP server
   */
  start() {
    this.httpServer.listen({ port: this.port }, () =>
      console.log('Server ready at http://localhost:' + this.port),
    );
  }
}

module.exports = Object.freeze(Framework);

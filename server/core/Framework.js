const Koa = require('koa');
const Router = require('koa-router');
const ModuleManager = require('./ModuleManager');
const GraphqlManager = require('./GraphqlManager');

/**
 * Framework
 */
class Framework {

  /**
   *
   * @param {Function} router
   * @param {Array} middleware
   */
  constructor(router, middleware) {
    this.httpServer = new Koa();
    this.port = parseInt(process.env.FSTACK_HTTP_PORT || 4000, 10);
    this.middleware = middleware;
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
   * Using lazy loading of services
   */
  addMiddleware() {
    if (!this.middleware) this.middleware = ModuleManager.loadMiddleware();
    for (let name in this.middleware) this.middleware[name](this.httpServer);
  }

  /**
   * Apply module routes
   */
  addRoutes(router = null) {
    if (router) this.router = router;
    if (!this.router) this.router = new Router();
    const routes = ModuleManager.loadRoutes();
    for (let name in routes) routes[name](this.httpServer, this.router);

    // Check if authorization is enabled
    let RouterAuthorization = false;
    if (!!process.env.FSTACK_AUTHORIZATION) {
      RouterAuthorization = require('./RouterAuthorization');
      const authRouter = RouterAuthorization.getRouter(this.router);
      this.httpServer.use(authRouter.routes())
        .use(authRouter.allowedMethods());
    } else {
      this.httpServer.use(this.router.routes())
        .use(this.router.allowedMethods());
    }
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

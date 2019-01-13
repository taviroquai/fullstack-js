const fs = require('fs');
const http = require('http');
const https = require('https');
const Koa = require('koa');
const Router = require('koa-router');

/**
 * Register global framework includer
 * Automatically resolves to enabled modules and its files
 * instead in require them with hardcoded filepath
 */
global.use = (filepath) => {
  let filename = __dirname + '/../modules/enabled/' + filepath;
  if (filepath.indexOf('core') === 0) filename = __dirname + '/../' + filepath;
  return require(filename);
};

// Require framework tools
const ModuleManager = use('core/ModuleManager');
const Authorization = use('core/Authorization');
const GraphqlManager = use('core/GraphqlManager');

/**
 * Framework
 */
class Framework {

  /**
   * Create framework instance
   * 
   * @param {Object} options
   */
  constructor(options) {
    this.app = new Koa(options);
    this.port = parseInt(process.env.FSTACK_HTTP_PORT || 4000, 10);
    this.router = options && options.router ?
      options.router
      : new Router();
    this.httpServer = options && options.https ?
      http.createServer(this.app.callback())
      : https.createServer(this.app.callback());
      this.middleware = null;

    // Protect private props/functions
    const api = Object.freeze({
      getModuleManager: () => {
        return ModuleManager;
      },
      getAuthorization: () => {
        return Authorization;
      },
      getGraphqlManager: () => {
        return GraphqlManager;
      },
      getKoa: () => {
        return this.app;
      },
      getHTTPServer: (options) => {
        return this.getHTTPServer(options);
      },
      getHTTPRouter: (options) => {
        return this.getHTTPRouter(options);
      },
      requireMiddleware: () => {
        return this.requireMiddleware();
      },
      addRoutes: (server, router, RouterAuthorization) => {
        this.addRoutes(server, router, RouterAuthorization);
      }
    });

    // Only public methods
    return api;
  }

  /**
   * Get HTTP Server
   */
  getHTTPServer() {
    return this.httpServer;
  }

  /**
   * Create HTTP Router
   */
  getHTTPRouter() {
    return this.router;
  }

  /**
   * Require middleware
   */
  requireMiddleware() {
    const middlewareList = this.getMiddlewareNames();
    const middleware = {};
    for (let name of middlewareList) {
      middleware[name] = require('../middleware/enabled/' + name);
    }
    return middleware;
  }

  /**
   * Get middleware names
   */
  getMiddlewareNames() {
    const path = './middleware/enabled';
    let names = fs.readdirSync(path)
    .filter(file => {
      return !fs.statSync(path+'/'+file).isDirectory();
    });
    return names;
  }

  /**
   * Apply module routes
   */
  addRoutes(server, router, RouterAuthorization) {
    const routes = ModuleManager.loadRoutes();
    for (let name in routes) routes[name](server, router);
    if (RouterAuthorization) router = RouterAuthorization.getRouter(router);
    server.use(router.routes()).use(router.allowedMethods());
  }
}

module.exports = Object.freeze(Framework);

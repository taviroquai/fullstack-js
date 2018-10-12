const fs = require('fs');
const merge = require('lodash.merge');

/**
 * Module manager
 */
class ModuleManager {

  /**
   * Get modules names
   */
  static getModulesNames() {
    const path = './modules';
    let modules = fs.readdirSync(path)
    .filter(file => {
      return fs.statSync(path+'/'+file).isDirectory();
    });
    return modules;
  }

  /**
   * Load middleware
   */
  static loadMiddleware() {
    const middlewareList = ModuleManager.getMiddlewareNames();
    const middleware = {};
    for (let name of middlewareList) {
      middleware[name] = require('../middleware/' + name);
    }
    return middleware;
  }

  /**
   * Get middleware names
   */
  static getMiddlewareNames() {
    const path = './middleware';
    let names = fs.readdirSync(path)
    .filter(file => {
      return !fs.statSync(path+'/'+file).isDirectory();
    });
    return names;
  }

  /**
   * Load routes
   */
  static loadRoutes() {
    const routes = {};
    const modules = ModuleManager.getModulesNames();
    for (let name of modules) {
      routes[name] = require('../modules/' + name + '/routes');
    }
    return routes;
  }

  /**
   * Get resources names
   */
  static getResourcesNames() {
    let combinedResolvers = {};
    const modulesList = ModuleManager.getModulesNames();
    for (let m of modulesList) {
      let modelResolvers = require('../modules/' + m + '/resolvers');
      combinedResolvers = merge(combinedResolvers, modelResolvers);
    }
    let resources = [];
    Object.keys(combinedResolvers).map(type => {
      Object.keys(combinedResolvers[type]).map(name => {
        resources.push(type + '.' +name);
      });
    });

    // Return resources
    return resources;
  }

  /**
   * Get hooks names
   */
  static getHooksNames() {
    let hooks = [];
    fs.readdirSync('./hooks').forEach(filename => {
      const regex = new RegExp("\.([^/.]+)$", "ig");
      let result = regex.exec(filename);
      if (result && result[1].toLowerCase() === 'js') {
        hooks.push(filename.replace(/\.[^/.]+$/, ""));
      }
    });
    return hooks;
  }
}

module.exports = ModuleManager;

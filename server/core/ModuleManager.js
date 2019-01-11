const fs = require('fs');
const Router = require('koa-router');

/**
 * Module manager
 */
class ModuleManager {

  /**
   * Get modules names
   */
  static getModulesNames() {
    const path = './modules/enabled';
    let modules = fs.readdirSync(path)
    .filter(file => {
      return fs.statSync(path+'/'+file).isDirectory();
    });
    return modules;
  }

  /**
   * Resolve module path
   * 
   * @param {String} name 
   */
  static resolveModulePath(name) {
    return './modules/enabled/' + name;
  }

  /**
   * Load routes
   */
  static loadRoutes() {
    const self = ModuleManager;
    const routes = {};
    const modules = self.getModulesNames();
    for (let name of modules) {
      let filePath = self.resolveModulePath(name) + '/routes.js';
      let requirePath = '.' + self.resolveModulePath(name) + '/routes';
      if (fs.existsSync(filePath)) routes[name] = require(requirePath);
    }
    return routes;
  }

  /**
   * Get resources names
   */
  static getResourcesNames() {
    const filename = (process.env.FSTACK_CACHE_PATH || "./cache")
      + '/resources.json';
    return require('.' + filename);
  }

  /**
   * Get cached authorization filename
   *
   * @param {String} name
   */
  static getCacheFilename(name) {
    return (process.env.FSTACK_CACHE_PATH || "./cache")
      + '/' + name + '.json';
  }

  /**
   * Update cache
   */
  static updateCache() {
    const self = ModuleManager;
    let filename = '';

    // Update resources
    let resources = self.generateResourcesNames()
    filename = self.getCacheFilename('resources');
    fs.writeFileSync(filename, JSON.stringify(resources, null, 2), 'utf-8');

    // Update hooks cache
    let hooks = self.generateHooksNames('before')
    filename = self.getCacheFilename('hooks_before');
    fs.writeFileSync(filename, JSON.stringify(hooks, null, 2), 'utf-8');
    hooks = self.generateHooksNames('after')
    filename = self.getCacheFilename('hooks_after');
    fs.writeFileSync(filename, JSON.stringify(hooks, null, 2), 'utf-8');
  }

  /**
   * Get resources names
   */
  static generateResourcesNames() {
    const self = ModuleManager;
    const modulesList = self.getModulesNames();
    let resources = [];

    // Get Graphql resources
    for (let m of modulesList) {
      let filePath = self.resolveModulePath(m) + '/resolvers.js';
      let requirePath = '.' + self.resolveModulePath(m) + '/resolvers';
      if (fs.existsSync(filePath)) {
        let resolvers = require(requirePath);
        Object.keys(resolvers).map(type => {
          Object.keys(resolvers[type]).map(name => {
            resources.push(type + '.' +name);
          });
        });
      }
    }

    // Get HTTP resources
    const router = new Router();
    for (let m of modulesList) {
      let filePath = self.resolveModulePath(m) + '/routes.js';
      let requirePath = '.' + self.resolveModulePath(m) + '/routes';
      if (fs.existsSync(filePath)) {
        let loader = require(requirePath);
        loader(null, router);
      }
    }
    const { stack } = router.routes().router;
    stack.map(layer => {
      resources.push(layer.path);
    });

    // Order alphabetically
    resources = resources.sort();

    // Return resources
    return resources;
  }

  /**
   * Get hooks filenames
   *
   * @param {String} type
   */
  static getHooksNames(type) {
    const filename = (process.env.FSTACK_CACHE_PATH || "./cache")
      + '/hooks_' + type + '.json';
    return require('.' + filename);
  }

  /**
   * Generate hooks cache
   *
   * @param {String} type
   */
  static generateHooksNames(type) {
    let hooks = [];
    const allowedExtensions = ['js'];
    fs.readdirSync('./hooks/' + type).forEach(f => {
      const regex = new RegExp("\.([^/.]+)$", "ig");
      let result = regex.exec(f);
      if (result && (allowedExtensions.indexOf(result[1].toLowerCase()) > -1)) {
        hooks.push(f.replace(/\.[^/.]+$/, ""));
      }
    });
    return hooks;
  }

  /**
   * Composes complete type definitions schema from modules
   */
  static generateGraphqlSchema() {
    const self = ModuleManager;
    let queries = '';
    let mutations = '';
    let types = '';
    const modulesList = self.getModulesNames();
    for (let m of modulesList) {
      let filename = self.resolveModulePath(m) + '/gql/queries.gql';
      if (fs.existsSync(filename)) queries += fs.readFileSync(filename)
    }
    for (let m of modulesList) {
      let filename = self.resolveModulePath(m) + '/gql/mutations.gql';
      if (fs.existsSync(filename)) mutations += fs.readFileSync(filename);
    }
    for (let m of modulesList) {
      let filename = self.resolveModulePath(m) + '/gql/types.gql';
      if (fs.existsSync(filename)) types += fs.readFileSync(filename);
    }

    // Combine all Graphql partials in one schema
    const schema = `
type Query {
  ${queries}
}

type Mutation {
  ${mutations}
}

${types}
`;

    // Return schema
    return schema;
  }
}

module.exports = ModuleManager;

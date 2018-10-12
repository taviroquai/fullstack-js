const ModuleManager = require('../core/ModuleManager');
const resources = ModuleManager.getResourcesNames();
const hooks = ModuleManager.getHooksNames();

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('resource_hooks').del()
    .then(function () {

      let items = [];
      for (let i = 0; i < hooks.length; i++) {
        for (let j = 0; j < resources.length; j++) {
          items.push({
            resource: resources[j],
            hook: hooks[i],
            order: i+1
          });
        }
      }

      // Insert
      return knex('resource_hooks').insert(items);

    });
};

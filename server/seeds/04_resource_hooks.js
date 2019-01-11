const Framework = require('../core/Framework');
const fw = new Framework();
const ModuleManager = fw.getModuleManager();
const resources = ModuleManager.getResourcesNames();
const hooksBefore = ModuleManager.getHooksNames('before');
const hooksAfter = ModuleManager.getHooksNames('after');

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('resource_hooks').del()
    .then(function () {

      let items = [];

      // Populate hooks of type before
      for (let i = 0; i < hooksBefore.length; i++) {
        for (let j = 0; j < resources.length; j++) {
          items.push({
            resource: resources[j],
            hook: hooksBefore[i],
            order: i+1,
            type: 'before',
            active: false
          });
        }
      }

      // Populate hooks of type after
      for (let i = 0; i < hooksAfter.length; i++) {
        for (let j = 0; j < resources.length; j++) {
          let active = /create|update/i.test(resources[j]) && hooksAfter[i] === '01_updateAuthorizationCache';
          items.push({
            resource: resources[j],
            hook: hooksAfter[i],
            order: i+1,
            type: 'after',
            active
          });
        }
      }

      // Insert
      return knex('resource_hooks').insert(items);

    });
};

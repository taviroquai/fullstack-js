const Framework = require('../core/Framework');
const fw = new Framework();
const ModuleManager = fw.getModuleManager();
const hooksBefore = ModuleManager.getHooksNames('before');
const hooksAfter = ModuleManager.getHooksNames('after');

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('role_hooks').del()
    .then(function () {

      return knex.select('id').from('roles').then(function(roles) {

        let items = [];

        // Hooks of type before
        for (let i = 0; i < hooksBefore.length; i++) {
          for (let j = 0; j < roles.length; j++) {
            items.push({
              role_id: roles[j].id,
              hook: hooksBefore[i]
            });
          }
        }

        // Hooks of type after
        for (let i = 0; i < hooksAfter.length; i++) {
          for (let j = 0; j < roles.length; j++) {
            items.push({
              role_id: roles[j].id,
              hook: hooksAfter[i]
            });
          }
        }

        // Insert
        return knex('role_hooks').insert(items);

      });
    });
};

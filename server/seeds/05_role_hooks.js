const ModuleManager = require('../ModuleManager');
const hooks = ModuleManager.getHooksNames();

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('role_hooks').del()
    .then(function () {

      return knex.select('id').from('roles').then(function(roles) {

        let items = [];
        for (let i = 0; i < hooks.length; i++) {
          for (let j = 0; j < roles.length; j++) {
            items.push({
              role_id: roles[j].id,
              hook: hooks[i]
            });
          }
        }

        // Insert
        return knex('role_hooks').insert(items);

      });
    });
};

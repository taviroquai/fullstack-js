const ModuleManager = require('../ModuleManager');
const resources = ModuleManager.getResourcesNames();

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(function () {

      return knex.select('id', 'system').from('roles').then(function(roles) {

        let permissions = [];
        for (let i = 0; i < roles.length; i++) {
          for (let j = 0; j < resources.length; j++) {
            let permission = {
              resource: resources[j],
              role_id: roles[i].id,
              access: roles[i].system === 'ANONYMOUS' 
                && resources[j] !== 'Query.getAccessToken' ? false : true
            };
            permissions.push(permission);
          }
        }

        // Insert
        return knex('permissions').insert(permissions);

      });
    });
};

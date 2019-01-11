const Framework = require('../core/Framework');
const fw = new Framework();
const ModuleManager = fw.getModuleManager();
const resources = ModuleManager.getResourcesNames();

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(function () {

      return knex.select('id', 'system').from('roles').then(function(roles) {

        const allowed = [
          'Query.getAccessToken',
          'Query.recoverUserPassword',
          'Mutation.resetUserPassword',
          'Query.getHello',
          '/authorization',
          '/hello/:name',
          '/avatar/:id/:filename'
        ];
        let permissions = [];
        for (let i = 0; i < roles.length; i++) {
          for (let j = 0; j < resources.length; j++) {
            let permission = {
              resource: resources[j],
              role_id: roles[i].id,
              access: roles[i].system === 'ANONYMOUS'
                && (allowed.indexOf(resources[j]) === -1) ? false : true
            };
            permissions.push(permission);
          }
        }

        // Insert
        return knex('permissions').insert(permissions);

      });
    });
};

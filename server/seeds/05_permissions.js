exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(function () {

      return knex.select('id', 'system').from('roles').then(function(roles) {
        return knex.select('id').from('resources').then(function(resources) {

          let permissions = [];
          for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < resources.length; j++) {
              let permission = {
                resource_id: resources[j].id,
                role_id: roles[i].id,
                access: roles[i].system === 'ANONYMOUS' ? false : true
              };
              permissions.push(permission);
            }
          }

          // Insert
          return knex('permissions').insert(permissions);

        });
      });
    });
};

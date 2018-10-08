exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(function () {
      
      return knex.select('id').from('roles').then(function(roles) {
        return knex.select('id').from('resources').then(function(resources) {
        
          let permissions = [];
          for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < resources.length; j++) {
              permissions.push({
                resource_id: resources[j].id,
                role_id: roles[i].id
              });
            }
          }

          // Insert
          return knex('permissions').insert(permissions);
          
        });
      });
    });
};

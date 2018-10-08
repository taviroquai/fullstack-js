exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('resource_hooks').del()
    .then(function () {
      
      return knex.select('id').from('hooks').then(function(hooks) {
        return knex.select('id').from('resources').then(function(resources) {
        
          let items = [];
          for (let i = 0; i < hooks.length; i++) {
            for (let j = 0; j < resources.length; j++) {
              items.push({
                resource_id: resources[j].id,
                hook_id: hooks[i].id,
                order: i+1
              });
            }
          }

          // Insert
          return knex('resource_hooks').insert(items);
          
        });
      });
    });
};

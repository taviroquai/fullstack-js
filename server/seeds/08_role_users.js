exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('role_users').del()
    .then(function () {

      return knex.select('id', 'system').from('roles').then(function(roles) {
        return knex.select('id').from('users').then(function(users) {

          let items = [];
          for (let i = 0; i < roles.length; i++) {
            for (let j = 0; j < users.length; j++) {
              let item = {
                user_id: users[j].id,
                role_id: roles[i].id,
                active: roles[i].system === 'SUPERUSER' ? true : false
              };
              items.push(item);
            }
          }

          // Insert
          return knex('role_users').insert(items);

        });
      });
    });
};

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('hooks').del()
    .then(function () {

      // Inserts seed entries
      return knex('hooks').insert([
        {
          id: 1,
          system: 'onlyAuthenticated'
        },
        {
          id: 2,
          system: 'onlySuperusers'
        },
      ]);
    });
};

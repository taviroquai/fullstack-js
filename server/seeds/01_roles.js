const bcrypt = require('bcrypt-nodejs');

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {

      // Inserts seed entries
      return knex('roles').insert([
        {
          id: 1,
          label: 'Superuser',
          system: 'SUPERUSER'
        }
      ]);
    });
};

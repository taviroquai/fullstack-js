const bcrypt = require('bcrypt-nodejs');

exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {

      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          username: 'admin',
          email: 'admin@isp.com',
          password: bcrypt.hashSync('admin'),
          avatar: 'admin.jpg',
          active: true,
          role_id: 1
        }
      ]);
    });
};

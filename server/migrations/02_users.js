
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username').unique();
    table.string('email').unique();
    table.string('password');
    table.string('avatar');
    table.boolean('active').default(false);
    table.string('resettoken');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};


exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username');
      table.string('email');
      table.string('password');
      table.string('authtoken');

      // Foreign key
      table.integer('parentId').unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};

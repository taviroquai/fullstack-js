
exports.up = function(knex, Promise) {
  return knex.schema.createTable('role_users', table => {
    table.increments('id').primary();

    // Role relation
    table.integer('role_id').unsigned().default(2)
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');

    // Hook relation
    table.integer('user_id').unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // Active
    table.boolean('active').default(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('role_users');
};

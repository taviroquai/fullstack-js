
exports.up = function(knex, Promise) {
  return knex.schema.createTable('role_hooks', table => {
    table.increments('id').primary();

    // Role relation
    table.integer('role_id').unsigned()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');

    // Hook relation
    table.integer('hook_id').unsigned()
      .references('id')
      .inTable('hooks')
      .onDelete('CASCADE');

    // Active
    table.boolean('bypass').default(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('role_hooks');
};

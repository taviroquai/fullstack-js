
exports.up = function(knex, Promise) {
  return knex.schema.createTable('permissions', table => {
    table.increments('id').primary();

    // Role relation
    table.integer('role_id').unsigned()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');

    // Resource
    table.string('resource');

    // Access: allow/deny
    table.boolean('access').default(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('permissions');
};

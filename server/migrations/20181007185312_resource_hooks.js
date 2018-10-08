
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resource_hooks', table => {
    table.increments('id').primary();

    // Resource relation
    table.integer('resource_id').unsigned()
      .references('id')
      .inTable('resources')
      .onDelete('CASCADE');

    // Role relation
    table.integer('hook_id').unsigned()
      .references('id')
      .inTable('hooks')
      .onDelete('CASCADE');

    // Active
    table.boolean('active').default(false);

    // Order
    table.integer('order').default(1);

    // Type: before/after
    table.string('type').default('before');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('resource_hooks');
};

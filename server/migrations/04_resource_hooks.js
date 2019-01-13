
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resource_hooks', table => {
    table.increments('id').primary();

    // Resource
    table.string('resource');

    // Hook
    table.string('hook');

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

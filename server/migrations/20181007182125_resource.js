
exports.up = function(knex, Promise) {
  return knex.schema.createTable('resources', table => {
    table.increments('id').primary();
    table.string('system').unique();
    table.string('resolver');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('resources');
};

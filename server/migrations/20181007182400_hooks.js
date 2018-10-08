
exports.up = function(knex, Promise) {
  return knex.schema.createTable('hooks', table => {
    table.increments('id').primary();
    table.string('system').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('hooks');
};

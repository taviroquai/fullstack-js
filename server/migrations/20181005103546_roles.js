
exports.up = function(knex, Promise) {
  return knex.schema.createTable('roles', table => {
    table.increments('id').primary();
    table.string('label').unique();
    table.string('system').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('roles');
};

// Load enviroment if not loaded yet
!process.env.FSTACK_APP_NAME && require('dotenv').config();

// Load config from enviroment
module.exports = {
  development: {
    client: process.env.FSTACK_KNEX_CLIENT,
    debug: process.env.FSTACK_KNEX_DEBUG,
    version: process.env.FSTACK_KNEX_CLIENT_VERSION,
    connection: {
      host : process.env.FSTACK_KNEX_HOST,
      user : process.env.FSTACK_KNEX_USER,
      password : process.env.FSTACK_KNEX_PASS,
      database : process.env.FSTACK_KNEX_DBNAME
    },
    pool: {
      min: parseInt(process.env.FSTACK_KNEX_POOL_MIN, 10),
      max: parseInt(process.env.FSTACK_KNEX_POOL_MAX, 10)
    },
    migrations: {
      tableName: process.env.FSTACK_KNEX_MIGRATIONS_TABLE
    },
    seeds: {
      directory: process.env.FSTACK_KNEX_SEED_DIRECTORY
    }
  }
};

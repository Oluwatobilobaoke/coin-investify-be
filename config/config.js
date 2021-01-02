require('dotenv').config();

module.exports = {
  development: {
    username: process.env.COIN_INVESTIFY_DB_USER,
    password: process.env.COIN_INVESTIFY_DB_PASSWORD,
    database: process.env.COIN_INVESTIFY_DB_NAME,
    host: process.env.COIN_INVESTIFY_DB_HOST,
    dialect: process.env.COIN_INVESTIFY_DB_DIALECT,
    logging: false,
  },
  test: {
    username: process.env.COIN_INVESTIFY_DB_USER,
    password: process.env.COIN_INVESTIFY_DB_PASSWORD,
    database: process.env.COIN_INVESTIFY_DB_NAME,
    host: process.env.COIN_INVESTIFY_DB_HOST,
    dialect: process.env.COIN_INVESTIFY_DB_DIALECT,
    logging: true, // TODO USe test first when on the server
  },
  production: {
    username: process.env.COIN_INVESTIFY_DB_USER,
    password: process.env.COIN_INVESTIFY_DB_PASSWORD,
    database: process.env.COIN_INVESTIFY_DB_NAME,
    host: process.env.COIN_INVESTIFY_DB_HOST,
    dialect: process.env.COIN_INVESTIFY_DB_DIALECT,
    logging: false,
  },
}


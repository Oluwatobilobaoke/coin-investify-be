const redis = require('redis');
const bluebird = require('bluebird');
const logger = require('../../../../logger').Logger;

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis);

// Create a client and connect to Redis using configuration from env
const clientConfig = {
  host: process.env.COIN_INVESTIFY_REDIS_HOST,
  port: process.env.COIN_INVESTIFY_REDIS_PORT,
};

if (process.env.COIN_INVESTIFY_REDIS_PASSWORD !== 'null') {
  clientConfig.password = process.env.COIN_INVESTIFY_REDIS_PASSWORD;
}

const client = redis.createClient(clientConfig);

// This is a catch all basic error handler.
client.on('error', (error) => {
  if (typeof error === 'string') logger.error(error);
  else logger.error(JSON.stringify(error));
});

module.exports = {
  /**
   * Get the application's connected Redis client instance.
   *
   * @returns {Object} - a connected node_redis client instance.
   */
  getClient: () => client,
};

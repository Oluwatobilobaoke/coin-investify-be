// Prefix that all keys will start with, taken from .env file
let prefix = process.env.COIN_INVESTIFY_REDIS_KEY_PREFIX;

/**
 * Takes a string containing a Redis key name and returns a
 * string containing that key with the application's configurable
 * prefix added to the front.  Prefix is configured in .env file.
 *
 * @param {string} key - a Redis key
 * @returns {string} - a Redis key with the application prefix prepended to
 *  the value of 'key'
 */
const getKey = (key) => `${prefix}:${key}`;

/**
 * Takes a numeric site ID and returns the information key
 * value for that ID.
 *
 * Key name: prefix:coin-investify:info:[siteId]
 * Redis type stored at this key: hash
 *
 * @param {string} id - the numeric ID of a site.
 * @returns - the information key for the provided ID.
 */
const getHashKey = (id) => getKey(`coin-investify:info:${id}`);

/**
 * Returns the Redis key name used for the set storing all IDs.
 *
 * Key name: prefix:coin-investify:ids
 * Redis type stored at this key: set
 *
 * @returns - the Redis key name used for the set storing all IDs.
 */
const getIDsKey = () => getKey('coin-investify:ids');

/**
 * Set the global key prefix, overriding the one set in .env file.
 *
 * This is used by the test suites so that test keys do not overlap
 * with real application keys and can be safely deleted afterwards.
 *
 * @param {*} newPrefix - the new key prefix to use.
 */
const setPrefix = (newPrefix) => {
  prefix = newPrefix;
};

module.exports = {
  getHashKey,
  getIDsKey,
  setPrefix,
  getKey,
};

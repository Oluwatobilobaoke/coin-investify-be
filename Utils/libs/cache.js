const redis = require('../../Controllers/dao/impl/redis/redis-client');
const logger = require('../../logger').Logger;

const client = redis.getClient();

module.exports = class Cache {
  constructor() {
    this.client = client;
  }

  async set(key, data) {
    this.client.setAsync(key, JSON.stringify(data));
  }

  async get(key) {
    const res = await this.client.getAsync(key);
    return res && JSON.parse(res);
  }

  async del(key) {
    const res = await this.client.delAsync(key);
    return res;
  }

  async reset(key, query) {
    try {
      const res = await this.client.getAsync(key);
      const obj = JSON.parse(res);
      if (obj) {
        await this.client.del(key);
      }
      // Clearing and Resetting cache data... ✔
      await query;
    } catch (err) {
      logger.error(JSON.stringify(err));
      return err;
    }
    return null;
  }
};

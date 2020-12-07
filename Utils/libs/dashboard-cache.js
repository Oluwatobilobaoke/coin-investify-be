const redisKeys = require('../../Controllers/dao/impl/redis/redis-key-gen');

const Cache = require('./cache');

const cache = new Cache();

const investorDashboardCache = async (userId) => {
  const userKeyId = redisKeys.getHashKey(`user:${userId.toString()}`);
  const withdrawalKeyId = redisKeys.getHashKey(`withdrawal:${userId.toString()}`);
  const depositKeyId = redisKeys.getHashKey(`deposit:${userId.toString()}`);
  const activityKeyId = redisKeys.getHashKey(`activity:${userId.toString()}`);

  const deposits = await cache.get(depositKeyId);
  const user = await cache.get(userKeyId);
  const withdrawals = await cache.get(withdrawalKeyId);
  const activities = await cache.get(activityKeyId);
  if (user && withdrawals && deposits && activities) {
    return { user, withdrawals, deposits, activities };
  }
  return null;
};



module.exports = {
  investorDashboardCache,
};

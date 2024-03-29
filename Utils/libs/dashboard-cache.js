const redisKeys = require('../../Controllers/dao/impl/redis/redis-key-gen');

const Cache = require('./cache');

const cache = new Cache();

const investorDashboardCache = async (userId) => {
  const userKeyId = redisKeys.getHashKey(`user:${userId.toString()}`);
  const withdrawalKeyId = redisKeys.getHashKey(`withdrawal:${userId.toString()}`);
  const depositKeyId = redisKeys.getHashKey(`deposit:${userId.toString()}`);
  const activityKeyId = redisKeys.getHashKey(`activity:${userId.toString()}`);
  const referralKeyId = redisKeys.getHashKey(`referral:${userId.toString()}`);


  const deposits = await cache.get(depositKeyId);
  const user = await cache.get(userKeyId);
  const withdrawals = await cache.get(withdrawalKeyId);
  const activities = await cache.get(activityKeyId);
  const referrals = await cache.get(referralKeyId);
  if (user && withdrawals && deposits && activities && referrals) {
    return { user, withdrawals, deposits, activities, referrals };
  }
  return null;
};



module.exports = {
  investorDashboardCache,
};

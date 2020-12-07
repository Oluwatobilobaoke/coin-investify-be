const redisKeys = require('../../Controllers/dao/impl/redis/redis-key-gen');
const Cache = require('./cache');

const cache = new Cache();

const {
  createActivity,
  getActivities,
} = require('../../Controllers/dao/impl/db/activity');

const { errorResMsg } = require('./response');

const updateActivityCache = async (userId) => {
  const activityQuery = await getActivities(userId);
  const activities = await activityQuery;
  const activityKey = redisKeys.getHashKey(`activity:${userId.toString()}`);
  await cache.set(activityKey, activities);
};

const recordActivity = async (res, userId, type, message) => {
  switch (type) {
    case 'create':
      await createActivity(userId, type, message);
      await updateActivityCache(userId);
      break;
    case 'update':
      await createActivity(userId, type, message);
      await updateActivityCache(userId);
      break;
    case 'delete':
      await createActivity(userId, type, message);
      await updateActivityCache(userId);
      break;
    default:
      errorResMsg(res, 400, 'Activity not recognised');
      break;
  }
};

module.exports = recordActivity;

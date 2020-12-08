const { getActivities, deleteAnActivity } = require('../dao/impl/db/activity');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const redis = require('../dao/impl/redis/redis-client');
const redisKeys = require('../dao/impl/redis/redis-key-gen');
const logger = require('../../logger').Logger;

const client = redis.getClient();

/**
 * Activities on user's profile
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} custom response
 */
const getActivity = async (req, res) => {
  try {
    const { userId } = req.user;
    const activityKey = redisKeys.getHashKey(`activity:${userId.toString()}`);
    const dashboardKeyId = redisKeys.getHashKey(
      `dashboard:${userId.toString()}`
    );

    const activities = await getActivities(userId);

    // Setting data to cache ✔
    client.set(activityKey, JSON.stringify(activities));
    const data = { message: 'Activities recorded', activities };
    client.hmset(dashboardKeyId, {
      activities: JSON.stringify(activities),
    });

    return successResMsg(res, 200, data);
  } catch (err) {
    logger.error(err);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

/**
 * Delete an activity on user's profile
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} custom response
 */
const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { userId } = req.user;
    const activityKey = redisKeys.getHashKey(`activity:${userId.toString()}`);
    const dashboardKeyId = redisKeys.getHashKey(
      `dashboard:${userId.toString()}`
    );

    // return res.status(200).json({ userId });
    const result = await deleteAnActivity(activityId, userId);
    if (!result) {
      return errorResMsg(res, 400, {
        message: 'Activity does not exist or is not connected to your profile',
      });
    }
    const activities = await getActivities(userId);
    // Setting data to cache ✔
    client.set(activityKey, JSON.stringify(activities));
    const data = { message: 'Activity deleted successfully' };
    client.hmset(dashboardKeyId, {
      activities: JSON.stringify(activities),
    });
    return successResMsg(res, 200, data);
  } catch (err) {
    logger.error(err);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};
module.exports = {
  getActivity,
  deleteActivity,
};

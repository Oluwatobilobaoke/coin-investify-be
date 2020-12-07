const model = require('../../../../Models/index');
const { getActivities } = require('./activity');
const redisKeys = require('../redis/redis-key-gen');

const Cache = require('../../../../Utils/libs/cache');
const cache = new Cache();

module.exports = {


    getDashboard: async (userId, attributes) => {
        const userQuery = await model.User.findOne({
        where: { userId },
        attributes,
        });

        const withdrawalQuery = await model.withdrawal.findAll({ where: { userId } });
        const depositQuery = await model.deposit.findAll({ where: { userId } });

        const activityQuery = await getActivities(userId);

        const user = await userQuery;
        const userKey = redisKeys.getHashKey(`user:${userId.toString()}`);

        const withdrawals = await withdrawalQuery;
        const withdrawalKey = redisKeys.getHashKey(`withdrawal:${userId.toString()}`);

        const deposits = await depositQuery;
        const depositKey = redisKeys.getHashKey(`deposit:${userId.toString()}`);

        const activities = await activityQuery;
        const activityKey = redisKeys.getHashKey(`activity:${userId.toString()}`);

        await cache.set(userKey, user);

        await cache.set(withdrawalKey, withdrawals);

        await cache.set(depositKey, deposits);

        await cache.set(activityKey, activities);

        return { user, withdrawals, deposits, activities };
    },

};
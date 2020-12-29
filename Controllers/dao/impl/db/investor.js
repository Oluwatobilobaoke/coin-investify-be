const model = require('../../../../models/index');
const { getActivities } = require('./activity');
const { getReferralByUserId } = require('./referral');
const redisKeys = require('../redis/redis-key-gen');

const Cache = require('../../../../Utils/libs/cache');
const cache = new Cache();

module.exports = {


    getDashboard: async (userId, attributes) => {
        const userQuery = await model.User.findOne({
        where: { userId },
        attributes,
        });

        const withdrawalQuery = await model.Withdrawal.findAll({ where: { userId, withdrawalStatus: 'Successfull' }, });
        
        const depositQuery = await model.Deposit.findAll({ where: { userId, isActive: true }, });
        const referralQuery = await getReferralByUserId(userId);

        const activityQuery = await getActivities(userId);

        const user = await userQuery;
        const userKey = redisKeys.getHashKey(`user:${userId.toString()}`);

        const withdrawals = await withdrawalQuery;
        
        const wq = withdrawals.map(withdrawal => (withdrawal.dataValues) );
        
        const withdrawalTrans = wq.length;
    
        const totalWithdrawal = wq.reduce((total, withdrawal) => { return (total + withdrawal.amount); }, 0)

        const withdrawalKey = redisKeys.getHashKey(`withdrawal:${userId.toString()}`);

        const deposits = await depositQuery;

        const depositMap = deposits.map(deposit => (deposit.dataValues) );

        const depositTrans = depositMap.length;

        const totalActiveDeposit = depositMap.reduce((total, deposit) => { return (total + parseInt(deposit.amountInUsd)); }, 0)
        

        const depositKey = redisKeys.getHashKey(`deposit:${userId.toString()}`);

        const activities = await activityQuery;
        const activityKey = redisKeys.getHashKey(`activity:${userId.toString()}`);

        const referrals = await referralQuery;
        const referralKey = redisKeys.getHashKey(`referral:${userId.toString()}`);

        const totalTransactions = depositTrans + withdrawalTrans;
        
        await cache.set(userKey, user);

        await cache.set(withdrawalKey, totalWithdrawal);

        await cache.set(depositKey, totalActiveDeposit);

        await cache.set(activityKey, activities);

        await cache.set(referralKey, referrals);

        

        return { user, withdrawals: totalWithdrawal, deposits: totalActiveDeposit, activities, referrals, transactions: totalTransactions };
    },

};
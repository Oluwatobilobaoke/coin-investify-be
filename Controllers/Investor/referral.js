const moment = require('moment');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const logger = require('../../logger').Logger;

const {
  getReferralByUserId,
	getAllReferralsFromSingleUser,
} = require('../dao/impl/db/referral');

const {
  getPagination,
  getPagingData,
} = require('../../Utils/libs/pagination');

const recordActivity = require('../../Utils/libs/activity-cache');

const referralAttributes = [
	"firstName",
	"lastName",
]

const actionDate = moment().format();


module.exports.getReferralEarnings = async (req, res) => {
  try {
		const { userId } = req.params;
		const referralQuery = await getReferralByUserId(userId);
		const referralEarnings = referralQuery.referralEarnings;
		if (!referralEarnings) {
      return errorResMsg(res, 400, 'User is not Valid, id doesnt exist')
    }
    await recordActivity(res, userId, 'create', `You viewed your Referral Earnings As AT ${actionDate}`);

    return successResMsg(res, 200, referralEarnings);
		
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');    
  }
};

module.exports.getReferralCount = async (req, res) => {
  try {
		const { userId } = req.params;
		const referralQuery = await getReferralByUserId(userId); 
		const referredUserCount = referralQuery.referralCount;
		if (!referredUserCount) {
      return errorResMsg(res, 400, 'User is not Valid, id doesnt exist')
    }
    await recordActivity(res, userId, 'create', `You viewed your Referrals As AT ${actionDate}`);

    return successResMsg(res, 200, referredUserCount);
		
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');    
  }
};

module.exports.getReferralDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const referralKeyId = redisKeys.getHashKey(`referral:${userId.toString()}`);
    const referralCacheData = await cache.get(referralKeyId); // fetch from cache

    if (!referralCacheData) {
      const referralQuery = await getReferralByUserId(userId);
      const referralDetails = referralQuery.dataValues;
      if (!referralDetails) {
        return errorResMsg(res, 400, 'User is not Valid, id doesnt exist')
      }
      await cache.set(referralKeyId, referralDetails); // set email data to cache
      await recordActivity(res, userId, 'create', `You viewed your Referral Information As AT ${actionDate}`);
      return successResMsg(res, 200, referralDetails);
    };
    
    await recordActivity(res, userId, 'create', `You viewed your Referral Information As AT ${actionDate}`);
    return successResMsg(res, 200, referralCacheData);
		
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');    
  }
};

module.exports.getAllReferredUsers = async (req, res) => {
  try {
		const { userId, referralId } = req.params;

		const { page, size } = req.query;

		const { limit, offset } = getPagination(page, size);
		
		const referralQuery = await getAllReferralsFromSingleUser(referralId, referralAttributes, limit, offset); 
		const data = getPagingData(referralQuery.count, page, limit);

    const dataInfo = {
     referrals: referralQuery,
     referral: data,
    };

    await recordActivity(res, userId, 'create', `You viewed your Referrals As AT ${actionDate}`);

    return successResMsg(res, 200, dataInfo);
		
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');    
  }
};

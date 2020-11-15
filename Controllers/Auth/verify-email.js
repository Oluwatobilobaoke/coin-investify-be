const { verifyJWT } = require('../../Utils/libs/token');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const redisKeys = require('../dao/impl/redis/redis-key-gen');
const { addDays } = require('../../Utils/libs/dates');
const { getUserByEmail, updateUser } = require('../dao/impl/db/user');
const logger = require('../../logger').Logger;

// Verify Email
const verifyEmail = async (req, res) => {
  const {verification_token} = req.query;
  if (!verification_token) {
      return errorResMsg(res, 400, 'Verification Code missing');
  }

  const decoded = await verifyJWT(verification_token);
  if (
    decoded && decoded.name !== 'JsonWebTokenError' &&
    decoded.name !== 'TokenExpiredError'
  ) {
    try {
			const user = await getUserByEmail(decoded.email);
			if (!user) return errorResMsg(res, 400, 'Email has not been registered');
			if (user.status === '1') {
				const dataInfo = { message: 'This email has already been registered'};
				return successResMsg(res, 200, dataInfo);
			}

			const status = '1';

			const dataToUpdate = { status };
			const updatedUser = await updateUser({email: user.email}, dataToUpdate);
			if (updatedUser[0] === 1) {
        const keyId = redisKeys.getHashKey(`email:${user.email.toString()}`);
        const newUser = await getUserByEmail(user.email);
        await cache.set(keyId, newUser);

        // if (user.roleId === 'ROL-EMPLOYER') {
        //   const startDate = new Date();
        //   const endDate = addDays(startDate, 7);
        //   const subscriptionInfo = {
        //     userId: user.userId,
        //     plan: 'free',
        //     planId: 'null',
        //     startDate,
        //     endDate,
        //     subscriptionId: 'None',
        //   };
        //   const userSubscription = await getSubscription(user.userId);
        //   if (!userSubscription) await createSubscription(subscriptionInfo);
        // }
        const dataInfo = { message: 'Email verification successful' };
        return successResMsg(res, 200, dataInfo);
      }
    } catch (error) {
      logger.error(JSON.stringify(error));
      return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
  } else if (decoded.name === 'TokenExpiredError')
	return errorResMsg(res, 400, 'Verification email link has expired');
else if (decoded.name === 'JsonWebTokenError')
	return errorResMsg(res, 400, decoded.message);
else return errorResMsg(res, 500, 'Something went wrong!');
};


module.exports = {
  verifyEmail,
};
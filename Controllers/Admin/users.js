
const { getUserByEmail, updateUser } = require('../dao/impl/db/user');
const redisKeys = require('../dao/impl/redis/redis-key-gen');
const Cache = require('../../Utils/libs/cache');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const { addDays } = require('../../Utils/libs/dates');
const logger = require('../../logger').Logger;

const cache = new Cache();

const verifyUserEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (user.status === '1') {
      const dataInfo = { message: 'This email has already been verified' };
      return successResMsg(res, 200, dataInfo);
    }
      const status = '1';

    const dataToUpdate = { status };
    const updatedUser = await updateUser({ email: user.email }, dataToUpdate);

    if (updatedUser[0] === 1) {
      const keyId = redisKeys.getHashKey(`email:${user.email.toString()}`);
      
      await cache.del(keyId);
      
      const newUser = await getUserByEmail(user.email);
      await cache.set(keyId, newUser);
      const dataInfo = { message: 'User Verification successful' };
      return successResMsg(res, 200, dataInfo);
    }
  } catch (err) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
  return false;
};

module.exports.GetAllUser = async (req, res) => {
    
}

module.exports = {
  verifyUserEmail,
};

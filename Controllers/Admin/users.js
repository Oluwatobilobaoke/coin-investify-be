
//const { getUserByEmail, updateUser } = require('../dao/impl/db/user');
// const redisKeys = require('../dao/impl/redis/redis-key-gen');
// const Cache = require('../../Utils/libs/cache');
const {
  getUserByEmail,
  updateUser,
  getAllInvestorUsers,
  getAllAdminUsers,
  getUserById,
} = require('../dao/impl/db/user')
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
// const { addDays } = require('../../Utils/libs/dates');
const logger = require('../../logger').Logger;
const {
  getPagination,
  getPagingData,
} = require('../../Utils/libs/pagination');

const {sendEmail} = require('../../Utils/libs/send-mail');


// const cache = new Cache();

const usersTableAttributes = [
  'email',
  'firstName',
  'roleId',
  'status',
  'block',
  'userId',
]

const singleInvestorAttributes = [
  'firstName',
  'lastName',
  'status',
  'block',
  'email',
  'country',
  'walletBalance',
  'roleId',
  'btcWalletAddress',
  'userId',
  'signInCount',
  'currentSignInOn',
  'LastSignInOn',
  'currentSignInIp',
  'LastSignInIp',
  'referralId',
  'referrer',
]

const verifyUserEmail = async (req, res) => { // TODO Tell Frontend its going to be an input field to verify a user : enter email
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

    //if (updatedUser[0] === 1) {
      // const keyId = redisKeys.getHashKey(`email:${user.email.toString()}`);
      
      // await cache.del(keyId);
      
      //const newUser = await getUserByEmail(user.email);
     //await cache.set(keyId, newUser);
     await sendEmail({
      email,
      subject: 'Coin-Investify Verification Status',
      message: `Good day, Your account has been successfully verified`,
    });
      const dataInfo = { message: 'User Verification successful' };
      return successResMsg(res, 200, dataInfo);
   // }
  } catch (err) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
  return false;
};

module.exports.GetAllInvestorUser = async (req, res) => {
  try {
      // const {userId } = req
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const allInvestors = await getAllInvestorUsers(usersTableAttributes, limit, offset);
    const data = getPagingData(allInvestors.count, page, limit);
    const dataInfo = {
      investors: allInvestors,
      investor: data,
    };

  //await recordActivity(res, userId, 'create', `Admin checked all user here As AT ${actionDate}`);
  return successResMsg(res, 200, dataInfo);
  } catch (error) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports.getSingleInvestor = async (req, res) => {

  const { userId } = req.params;
  try {
    const userQuery = await getUserAttributes(userId, singleInvestorAttributes);
    if (!userQuery) {
      return errorResMsg(res, 400, 'User does not exist')
    }
    const user = await userQuery.dataValues;

    return successResMsg(res, 200, user);

  } catch (error) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports.GetAllAdmin = async(req, res) => {
  try {
    
    const allAdmins = await getAllAdminUsers(usersTableAttributes, limit, offset);
    const data = getPagingData(allAdmins.count, page, limit);
    const dataInfo = {
      admins: allAdmins,
      admin: data,
    };

  return successResMsg(res, 200, dataInfo);
  } catch (error) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports.getSingleAdmin = async (req, res) => {

  const { userId } = req.params;
  try {
    const adminQuery = await getUserAttributes(userId, singleInvestorAttributes);
    if (!adminQuery) {
      return errorResMsg(res, 400, 'User does not exist')
    }
    const admin = await adminQuery.dataValues;

    return successResMsg(res, 200, admin);

  } catch (error) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports.blockAUser = async(req, res) => {
  const { userId } = req.params;
  try {
    
  const user = getUserById(userId);
  if (!user)
		return errorResMsg(res, 403, 'User does not exist');
  if (user.block === true) {
    const dataInfo = { message: 'This User has already been blocked/deactivated' };
    return successResMsg(res, 200, dataInfo);
  }
    const email = user.email;
    const block = true;

  const dataToUpdate = { block };
  await updateUser({ userId: user.userId }, dataToUpdate);
  await sendEmail({
    email,
    subject: 'Coin-Investify Deactivation Status',
    message: `Good day, Your account has been Deactivated `,
  });

  const dataInfo = { message: 'User Deactivation Successful' };
  return successResMsg(res, 200, dataInfo);
      
  } catch (error) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports.unBlockAUser = async(req, res) => {
  const { userId } = req.params;

  try {
    
   const user = getUserById(userId);
   
  if (!user)
		return errorResMsg(res, 403, 'user does not exist');
  if (user.block === false) {
    const dataInfo = { message: 'This User is already activated' };
    return successResMsg(res, 200, dataInfo);
  }
    const email = user.email;
    const block = false;

    const dataToUpdate = { block };
    await updateUser({ userId: user.userId }, dataToUpdate);
    await sendEmail({
      email,
      subject: 'Coin-Investify Activation Status',
      message: `Good day, Your account has been reinstated`,
    });

  const dataInfo = { message: 'User Activation Successful' };
  return successResMsg(res, 200, dataInfo);
      
  } catch (error) {
    logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

// module.exports.updateUserInformation = async(req, res) => {
//   const { userId} = req.params;

//   const {
//     firstName,
//     lastName,
//     country,
//     btcWalletAddress,
//   }
// }

module.exports.creditUserWallet = async (req, res) => {
  const { userId } = req.params;
  try {

    const {
      topUpAmount
    } = req.body;
    
    const user = getUserById(userId);
    if (!user)
      return errorResMsg(res, 403, 'User does not exist');
      const email = user.email;
      
      let walletBalance;
      const walletBalance = user.walletBalance;
      const updatedWalletBalance = walletBalance + topUpAmount; 
      walletBalance = updatedWalletBalance;

      await sendEmail({
        email,
        subject: 'Coin-Investify Credit Notification',
        message: `Good day, Your account has been credited with ${topUpAmount}`,
      });
  
      const dataToUpdate = { walletBalance };
      await updateUser({ userId: user.userId }, dataToUpdate);

    
      const dataInfo = { message: `User Wallet Top Up Successfull,  Amount: ${ topUpAmount }` };
      return successResMsg(res, 200, dataInfo);
        
    } catch (error) {
      logger.error(err);
      logger.error(JSON.stringify(err));
      return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
}

module.exports.debitUserWallet = async (req, res) => {
  const { userId } = req.params;
  try {

    const {
      debitAmount
    } = req.body;
    
    const user = getUserById(userId);
    if (!user)
      return errorResMsg(res, 403, 'User does not exist');
      
      const email = user.email;

      let walletBalance;
      const walletBalance = user.walletBalance;
      if (debitAmount > walletBalance) {
        return errorResMsg(res, 400, 'Insufficient Funds');
      }

      const updatedWalletBalance = walletBalance - debitAmount; 
      walletBalance = updatedWalletBalance;

      await sendEmail({
        email,
        subject: 'Coin-Investify Debit Notification',
        message: `Good day, Your account has been debited with ${debitAmount}`,
      });
  
    const dataToUpdate = { walletBalance };
    await updateUser({ userId: user.userId }, dataToUpdate);
  
    const dataInfo = { message: `User debited Successfully : ${debitAmount}` };
    return successResMsg(res, 200, dataInfo);
        
    } catch (error) {
      logger.error(err);
      logger.error(JSON.stringify(err));
      return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }

}

module.exports = {
  verifyUserEmail,
};

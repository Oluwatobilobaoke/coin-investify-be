const { v4 } = require ('uuid');
const moment = require('moment');
const {sendEmail} = require('../../Utils/libs/send-mail');

const { successResMsg, errorResMsg } = require('../../Utils/libs/response');

const logger = require('../../logger').Logger;

const {
  getUserById,
} = require('../dao/impl/db/user');

const {
  createWithdrawal,
  getAllWithdrawalsFromSingleUser,
  cancelWithdrawalStatus,
  getAWithdrawalById,
  getWithdrawalAttributes,
} = require('../dao/impl/db/withdrawal');

const {
  getPagination,
  getPagingData,
} = require('../../Utils/libs/pagination');

// const {
//   getReferralByUserId,
// } = require('../dao/impl/db/referral');

const {
    registerEmailContent,
} = require('../../Utils/libs/email-templates/user-withdrawal-email-template');

const withdrawalPublicAttributes = [
  'amount',
  'coinType',
  'WalletAddress',
  'withdrawalId',
  'withdrawalStatus',
];

const withdrawalAttributes = [
  'amount',
  'coinType',
  'withdrawalId',
  'withdrawalStatus',
];

const recordActivity = require('../../Utils/libs/activity-cache');

const actionDate = moment().format();

const initiateWithdrawal = async (req, res) => {
     
  const {
    coinType,
    amount,
    WalletAddress,
    userId,
  } = req.body;

  const userDetails = await getUserById(userId);
  if (!userDetails) {
    return errorResMsg(res, 400, 'User Does not exist')
  };
  const currentWallet = parseInt(userDetails.dataValues.walletBalance);
  const email = userDetails.dataValues.email;
  const firstName = userDetails.dataValues.firstName;
  // console.log('passed 1', currentWallet);

  if (amount > currentWallet) {
    return errorResMsg(res, 400, 'Insufficent Funds, Kindly check your Wallet Balance')
  }

  console.log('passed 2');

	const withdrawalId = v4();

  const withdrawalInformation = {
    coinType,
    amount,
    WalletAddress,
    withdrawalId,
    userId,
  };

  console.log('passed 3', withdrawalInformation);
  
  try {
    await createWithdrawal(withdrawalInformation);

    await sendEmail({
      email,
      subject: 'Coin-Investify Withdrawal Notification',
      message: await registerEmailContent(firstName, amount, WalletAddress),
    });

    await recordActivity(res, userId, 'create', `You initiated a withdrawal request As AT ${actionDate}`);
    const dataInfo = { message: 'Your Withdrawal request is being processed!' };
    successResMsg(res, 201, dataInfo);  
        
  } catch (error) {
		logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
	return false;
};

const getUserWithdrawals = async (req, res) => {

  const { userId } = req.params;
  
 try {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const allWithdrawals = await getAllWithdrawalsFromSingleUser(userId, withdrawalAttributes, limit, offset);
  const data = getPagingData(allWithdrawals.count, page, limit);
   const dataInfo = {
      withdrawals: allWithdrawals,
      withdrawal: data,
    };

  await recordActivity(res, userId, 'create', `You viewed all your withdrawals request As AT ${actionDate}`);
  return successResMsg(res, 200, dataInfo);
  } catch (error) {
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

const getWithdrawal = async (req, res) => {
    
  try {
    const { userId, withdrawalId } = req.params;
    const withdrawalQuery = await getWithdrawalAttributes(withdrawalId, withdrawalPublicAttributes);
    const withdrawal = await withdrawalQuery.dataValues;

    if (!withdrawal) {
      return errorResMsg(res, 400, 'Withdrawal id doesnt exist')
    }
    await recordActivity(res, userId, 'create', `You viewed a withdrawal request As AT ${actionDate}`);

    return successResMsg(res, 200, withdrawal);
  } catch (error) {
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }

};

const cancelWithdrawalRequest = async (req, res) => {
  const { userId, withdrawalId } = req.params;

  try {
    const withdrawal = await getAWithdrawalById(withdrawalId);

    if (!withdrawal) {
      return errorResMsg(res, 400, "Withdrawal id doesn't exist")
    };

    if (withdrawal.status === 'Successfull') {
      return errorResMsg(res, 403, "You can't cancel this withdrawal request, it has been Approved");
    };

    if (withdrawal.status === 'Disapproved') {
      return errorResMsg(res, 403, "You can't cancel this withdrawal request, it has been Disapproved");
    }''

    await cancelWithdrawalStatus(withdrawalId);
    await recordActivity(res, userId, 'update', `You cancelled one of your withdrawal request As AT ${actionDate}`);

    return successResMsg(res, 200, 'Withdrawal Request Cancelled Successfully');
  } catch (error) {
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

  
module.exports = {
  initiateWithdrawal,
  cancelWithdrawalRequest,
  getUserWithdrawals,
  getWithdrawal,
};

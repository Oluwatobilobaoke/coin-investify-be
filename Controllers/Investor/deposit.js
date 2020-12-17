const axios = require('axios');
const Webhook = require('coinbase-commerce-node').Webhook;
const webhookSecret = process.env.COIN_INVESTIFY_COIN_BASE_WEBHOOK;
const moment = require('moment');
const {sendEmail} = require('../../Utils/libs/send-mail');
const adminEmail = process.env.COIN_INVESTIFY_TO_EMAIL;

const { successResMsg, errorResMsg } = require('../../Utils/libs/response');

const logger = require('../../logger').Logger;

const recordActivity = require('../../Utils/libs/activity-cache');

const {
  getUserById
} = require('../dao/impl/db/user');
const {
    registerEmailContent,
  } = require('../../Utils/libs/email-templates/user-deposit-email-template');

const {
  getPagination,
  getPagingData,
} = require('../../Utils/libs/pagination');

const {
  getAllDepositsFromSingleUser,
  getADepositById,
  updateDepositDateStatus,
  createDeposit,
  updateDepositStatus,
  getDepositAttributes,
  updateInterestPerday,
} = require('../../Controllers/dao/impl/db/deposit');

const depositPublicAttributes = [
  'depositStatus',
  'depositDate',
  'dateConfirmed',
  'matureDate',
  'coinType',
  'amountInUsd',
  'amountInBtc',
  'txnCode',
  'depositId',
];

const depositAttributes = [
  'depositStatus',
  'depositId',
  'depositDate',
  'matureDate',
  'coinType',
  'amountInUsd',
];

const actionDate = moment().format();

module.exports.initiateDepositCharge = async (req, res) => {
  
  try {
    const {
      coinType,
      amountInUsd,
      customerName,
      userId,
    } = req.body;

  const checkUser = await getUserById(userId);
  console.log(checkUser);

  const email = checkUser.dataValues.email;

  if (!checkUser) {
    return errorResMsg(res, 400, 'User does not exist')
  }
    const ObjectToBeSent = {
      name: 'Coin Investify Investment Deposit',
      description: 'Demystifying the habit of automating investment',
      pricing_type: 'fixed_price',
      local_price: {
        amount: amountInUsd,
        "currency": "USD"
      },
      metadata: {
        customer_id: userId,
        customer_name: customerName,
      },
    };



    const apiCallLink = 'https://api.commerce.coinbase.com/charges';

    const options = {
      headers: {
      'Content-Type': 'application/json',
      'X-CC-Api-Key': 'f0f3b3e8-6f62-4c92-b76d-22754cb5b6c5',
      'X-CC-Version': '2018-03-22',
      }
    };
    
    const reqSent = await axios.post(apiCallLink, ObjectToBeSent , options);
   

    const resPonse = await reqSent;

    const { data } = resPonse;

    const dataInfo = {
      chargeResponse : data.data
    } 

    const depositCharge = dataInfo.chargeResponse;
    
    let objectToBeSaved = {
      addressSentTo: depositCharge.addresses.bitcoin,
      txnCode: depositCharge.code,
      depositId: depositCharge.id,
      amountInUsd: depositCharge.pricing.local.amount,
      amountInBtc: depositCharge.pricing.bitcoin.amount,
      depositStatus: depositCharge.timeline[0].status,
      depositDate: depositCharge.timeline[0].time,
      coinType,
      userId,
    };

  
    const depositQuery = await createDeposit(objectToBeSaved);

    const deposit = depositQuery.dataValues;
  

    await sendEmail({
      email,
      subject: 'Coin-Investify Deposit Notification',
      message: await registerEmailContent(customerName, deposit.amountInUsd, deposit.amountInBtc, deposit.addressSentTo, deposit.depositDate, depositCharge.expires_at),
    });

    // console.log('passed here 2', deposit);


    const CoinbaseDataObj = {
      "message": "Deposit initiated successfully",
      deposit,
      expiresIn: depositCharge.expires_at,
    }

    await recordActivity(res, userId, 'create', `You initiated a Deposit As AT ${actionDate}`);

    return successResMsg(res, 201, CoinbaseDataObj);

        
  } catch (error) {
		logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
	return false;
};


module.exports.getAllDeposits = async (req, res) => {
  
  try {
    const {userId} = req.params;
    console.log(userId);
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const allDeposits = await getAllDepositsFromSingleUser(userId, depositAttributes, limit, offset);
    const data = getPagingData(allDeposits.count, page, limit);
     const dataInfo = {
      deposits: allDeposits,
      deposit: data,
      };

  await recordActivity(res, userId, 'create', `You viewed all your Deposit As AT ${actionDate}`);
  return successResMsg(res, 200, dataInfo);
    
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

module.exports.getDeposit = async (req, res) => {
  try {
    const { userId, depositId} = req.params;
    const depositQuery = await getDepositAttributes(depositId, depositPublicAttributes);
    const deposit = await depositQuery.dataValues;
    if (!deposit) {
      return errorResMsg(res, 400, 'deposit id doesnt exist')
    }
    await recordActivity(res, userId, 'create', `You viewed a Deposit request As AT ${actionDate}`);

    return successResMsg(res, 200, deposit);
    
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};


module.exports.depositListener = async (req, res) => {
  try {

    const {event} = req.body;

    try {
      Webhook.verifyEventBody(
      event,
      request.headers['x-cc-webhook-signature'],
      webhookSecret
      );
      console.log('Successfully Verified');
    } catch (error) {
      console.log('Webhook Error occurred', error.message);
    }

    console.log('passed 1', event);

    
    const CoinbaseDataObj= {
      type: event.type,
      code: event.data.code,
      timelineStatus: event.data.timeline,
      id: event.id,
      dateConfirmed: event.data.confirmed_at,
      amount: event.data.pricing.local.amount,
    };

    console.log('passed 2', CoinbaseDataObj);
    console.log('passed 2', CoinbaseDataObj.dateConfirmed);


    async function updateStatusFromCharge(CoinbaseDataObj) {
      
      const data = CoinbaseDataObj;
      
      switch (data.type) {
        case 'charge:confirmed':
         console.log('confirmed', data.type);
         console.log('confirmedAt', data.dateConfirmed);
          await updateDepositStatus(data.code, 'Successfull');
          await updateDepositDateStatus(data.code, data.dateConfirmed)
          await updateInterestPerday(data.code, data.amount);
          break;
        case 'charge:pending':
          console.log('pending', data.type);
         await updateDepositStatus(data.code, 'Pending');
          break;
        case 'charge:created':
          console.log('created', data.type);
          await updateDepositStatus(data.code, 'Created');
          break;
        case 'charge:failed':
          console.log('failed', data.type);
          await updateDepositStatus(data.code, 'Expired');
          break;
        case 'charge:delayed':
          console.log('delayed', data.type);
          await updateDepositStatus(data.code, 'Delayed');
          break;
        case 'charge:resolved':
          console.log('resolved', data.type);
          await updateDepositStatus(data.code, 'Resolved');
          break;
        default:
          break;
      }
    };

    updateStatusFromCharge(CoinbaseDataObj);

    console.log('passed 3 DId it hoodlum FC');
    
  } catch (error) {
    logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};
  

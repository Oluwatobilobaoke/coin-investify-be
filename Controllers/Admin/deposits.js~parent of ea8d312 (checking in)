const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const logger = require('../../logger').Logger;
const {
  getPagination,
  getPagingData,
} = require('../../Utils/libs/pagination');

const {sendEmail} = require('../../Utils/libs/send-mail');

const {
	getDepositAttributes,
	getAllDeposits,
	deleteDepositById,
} = require('../dao/impl/db/deposit')

const depositTableAttributes = [

]

const depositPublicAttributes = [

]

module.exports.getAllInvestorDeposit = async (req, res) => {
  try {  
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const allDeposits = await getAllDeposits(depositTableAttributes, limit, offset);
    const data = getPagingData(allDeposits.count, page, limit);
    const dataInfo = {
      deposits: allDeposits,
      deposit: data,
    };
    
    await recordActivity(res, userId, 'create', `Admin was here As AT ${actionDate}`);
    return successResMsg(res, 200, dataInfo);
    } catch (error) {
      logger.error(err);
      logger.error(JSON.stringify(err));
      return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
}

module.exports.getInvestorDeposit = async (req, res) => {  // this end point is never to be made public is for the super admin
	try {
		const { depositId } = req.params;

		const depositQuery = await getDepositAttributes(depositId, depositPublicAttributes);
    const deposit = await depositQuery.dataValues;
    if (!deposit) {
      return errorResMsg(res, 400, 'deposit id does not exist')
    }
    // await recordActivity(res, userId, 'create', `You viewed a Deposit request As AT ${actionDate}`);

    return successResMsg(res, 200, deposit);
	} catch (error) {
		logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
}

module.exports.deleteDeposit = async (req, res) => {
	try {
		const { depositId } = req.params;

		const deposit = await getADepositById(depositId);
		if (!deposit) {
      return errorResMsg(res, 400, 'deposit id doesnt exist')
		}
		
		const dataInfo = { message: 'Deposit Deleted successfully' };
    return successResMsg(res, 200, dataInfo);
		
	} catch (error) {
		logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');		
	}

}

module.exports.confirmDeposit = async (req, res) => {
	try {
		
	} catch (error) {
		logger.error(err);
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
}
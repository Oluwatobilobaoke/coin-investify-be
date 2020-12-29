
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');

const {
  getUserById,
} = require('../dao/impl/db/user');

const {
  getUserWithdrawals 
} = require('./withdrawal');

const {
  getAllDeposits
} = require('./deposit');

module.exports.getAllTransactions = async (req, res) => {
  const { userId } = req.params;
    try {
			
			const userDetails = await getUserById(userId);
			if (!userDetails) {
				return errorResMsg(res, 400, 'User Does not exist')
			};
			 const withdrawals = getUserWithdrawals();
			 const deposits = getAllDeposits();

			const dataInfo = {
				withdrawals,
				deposits
			}
			 return successResMsg(res, 200, dataInfo)

		} catch (error) {
		logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
		}
};
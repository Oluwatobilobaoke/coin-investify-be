const moment = require('moment');

const logger = require('../../logger').Logger;

const {
  getUserByEmail,
	updateInvestorUserData,
	getUserById
} = require('../dao/impl/db/user');
    
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');

const recordActivity = require('../../Utils/libs/activity-cache');

const {
  registerEmailContent,
} = require('../../Utils/libs/email-templates/user-registration-email-template');
		
const actionDate = moment().format();

module.exports.updateProfile = async (req, res) => {
	const {userId} = req.params;

	try {
	let userExists = await getUserById(userId);

	if (!userExists) {
		return errorResMsg(res, 403, 'User does not exist');
	} 

	const {
		firstName,
		lastName,
		country,
		btcWalletAddress,
		} = req.body;

	
		
	const userUpdateInformation = {
		firstName,
		lastName,
		country,
		btcWalletAddress,
		userId,
	};

	await updateInvestorUserData(userUpdateInformation, userId)

	userExists = await getUserById(userId);

	const profile = userExists.dataValues;
	const dataInfo = { message: 'Profile Updated Successfully!', profile };
  successResMsg(res, 201, dataInfo);

	} catch (error) {
		logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');  
	}
};

module.exports.getProfile = async (req, res) => {
	const {userId} = req.params;

	try {
    const profileQuery = await getUserById(userId);
    const profile = await profileQuery.dataValues;

    if (!profile) {
      return errorResMsg(res, 400, 'User id doesnt exist')
    }
    await recordActivity(res, userId, 'create', `You viewed your profile As AT ${actionDate}`);

    return successResMsg(res, 200, profile);
	} catch (error) {
		logger.error(error);
  	return errorResMsg(res, 500, 'it is us, not you. Please try again');  
	}
}
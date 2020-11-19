const { v4 } = require('uuid');
const {sendEmail} = require('../../Utils/libs/send-mail');
const {
    getUserByEmail,
    createUser,
    getUserByPhoneNumber,
} = require('../dao/impl/db/user');

const { hashPassword } = require('../../Utils/libs/password');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const {
  registerEmailContent,
} = require('../../Utils/libs/email-templates/user-registration-email-template');
const { signJWT } = require('../../Utils/libs/token');

const logger = require('../../logger').Logger;

const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.COIN_INVESTIFY_DEV_URL
    : process.env.COIN_INVESTIFY_FRONT_END_URL;


const investorRegistration = async (req, res) => {

  const {
		firstName,
		lastName,
		email,
		country,
		phoneNumber,
		btcWallet,
		password,
	} = req.body;

	const userExists = await getUserByEmail(email);
	const userPhoneExists = await getUserByPhoneNumber(phoneNumber);
	if (userExists && userExists.email === email)
		return errorResMsg(res, 403, 'Email is already exist');
	if (userPhoneExists && userPhoneExists.phoneNumber === phoneNumber)
  	return errorResMsg(res, 403, 'phone number is not available');
		
	const hashedPassword = hashPassword(password);
	const userId = v4();

	const data = {
		email,
	};

	const token = signJWT(data);

	const userInformation = {
		firstName,
		lastName,
		email,
		country,
		phoneNumber,
		btcWallet,
		password: hashedPassword,
		roleId: 'ROL-INVESTOR',
		userId,
	};

	try {
		await createUser(userInformation);

    const verificationUrl = `${URL}/auth/email/verify/?verification_token=${token}`;
		await sendEmail({
			email,
			subject: 'Coin-Investify Email Verification',
			message: await registerEmailContent(firstName, verificationUrl),
		});

		const dataInfo = { message: 'Verification email sent!' };
    successResMsg(res, 201, dataInfo);

	} catch (error) {
	logger.error(error);
  return errorResMsg(res, 500, 'it is us, not you. Please try again');
	}
	return false;
}


module.exports = {
  investorRegistration,
};


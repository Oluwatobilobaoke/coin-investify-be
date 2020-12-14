const { v4 } = require('uuid');
const shortid = require('shortid');
const {sendEmail} = require('../../Utils/libs/send-mail');
const {
    getUserByEmail,
    createUser,
	} = require('../dao/impl/db/user');
	
const {
	getAReferralById,
	updateReferralActivity,
	createReferral,
} = require('../dao/impl/db/referral');

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

	const { ref } = req.query;


	let referrer;

 	 const {
		firstName,
		lastName,
		email,
		password,
		referrerCode,
	} = req.body;


		
	if(!ref && !referrerCode){
		referrer = 'No-Referral'
	} else if (ref || referrerCode) {
		referrer = req.query.ref || referrerCode;
	}

	
	const userExists = await getUserByEmail(email);
	

	if (userExists && userExists.email === email)
		return errorResMsg(res, 403, 'Email is already exist');


	if (referrer !== "No-Referral") {
		const findReferral = await getAReferralById(referrer);

		if (!findReferral)
			return errorResMsg(res, 403, 'Referral does not exist, kindly check your url')
		const currentReferral = findReferral;

		await updateReferralActivity(currentReferral);

	};
		
	const hashedPassword = hashPassword(password);
	const userId = v4();
	const referralId = shortid.generate();
	
	const data = {
		email,
	};

	const token = signJWT(data);

	const userInformation = {
		firstName,
		lastName,
		email,
		password: hashedPassword,
		roleId: 'ROL-INVESTOR',
		referralId,
		referrer,
		userId,
	};

	console.log('pass8', userInformation);

	const referralInformation = {
		referralId,
		userId,
	}

	try {
		await createUser(userInformation);
		await createReferral(referralInformation)

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


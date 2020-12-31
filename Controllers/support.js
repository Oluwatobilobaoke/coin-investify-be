const moment = require('moment');
const { v4 } = require('uuid');

const { successResMsg, errorResMsg } = require('../Utils/libs/response');
const {sendEmail} = require('../Utils/libs/send-mail');
const adminEmail = process.env.COIN_INVESTIFY_TO_EMAIL;
const logger = require('../logger').Logger;

const {
  getUserById,
} = require('./dao/impl/db/user');

const {
  getSupportByEmail,
  getSupportById,
  createSupport,
  updateSupportStatus,
  updateSupportData

	} = require('./dao/impl/db/support');


module.exports.createTicket = async (req, res) => {
		const {
			typeOfSupport,
			email,
			name,
			subject,
			description,
			priority,
			userId,
		} = req.body;
    
    const userExists = await getUserById(userId);
    console.log('passed here');
	
	if (!userExists)
    return errorResMsg(res, 403, 'User does not exist');
    
    console.log('passed here2');

 
    const supportId = v4();

    console.log('passed here3');


    const supportInformation = {
      typeOfSupport,
      email,
			name,
      subject,
      description,
      attachment: req.file.path,
      supportId,
      priority,
			userId,
    };

    console.log("supportInformation", supportInformation);
    try {
      await createSupport(supportInformation);

			await sendEmail({
				email,
				subject,
				message: `Hello You just created a ticket,Kindly hold on the admin will respond to you soon`
			})
			
			const dataInfo = { message: 'Ticket Created Successfully, The Admin will get back to you ASAP!' };
      successResMsg(res, 201, dataInfo);
        
    } catch (error) {
        logger.error(error);
        return errorResMsg(res, 500, 'it is us, not you. Please try again');
    }
	return false;
}


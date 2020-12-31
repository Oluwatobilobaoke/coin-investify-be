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
  getPagination,
  getPagingData,
} = require('../Utils/libs/pagination');

const attributes = [
  'typeOfSupport',
  'subject',
  'statusOfSupportTicket',
  'priority',
  'supportId',
  'updatedAt'
];

const supportPublicAttributes = [
  'typeOfSupport',
  'subject',
  'email',
  'name',
  'description',
  'attachment',
  'statusOfSupportTicket',
  'priority',
  'response',
  'supportId',
  'createdAt',
  'updatedAt'
]

const recordActivity = require('../Utils/libs/activity-cache');


const {
  getSupportByEmail,
  getSupportById,
  createSupport,
  updateSupportStatus,
  updateSupportData,
  getAllSupportsFromSingleUser,
  getSupportAttributes,
	} = require('./dao/impl/db/support');

  const actionDate = moment().format();

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

module.exports.getAllUserTicket = async (req, res) => {
  const { userId } = req.params;

  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const allSupportTicket = await getAllSupportsFromSingleUser(userId, attributes, limit, offset);
    const data = getPagingData(allSupportTicket.count, page, limit);
    const dataInfo = {
      tickets: allSupportTicket,
      ticket: data,
    };

  await recordActivity(res, userId, 'create', `You viewed all your Support Ticket As AT ${actionDate}`);
  return successResMsg(res, 200, dataInfo);
  } catch (error) {
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports.getSupportTicket = async (req, res) => {
  try {
    const { userId, supportId } = req.params;
    const SupportQuery = await getSupportAttributes(supportId, supportPublicAttributes);
    const Support = await SupportQuery.dataValues;

    if (!Support) {
      return errorResMsg(res, 400, 'Support id doesnt exist')
    }
    await recordActivity(res, userId, 'create', `You viewed a Support request As AT ${actionDate}`);

    return successResMsg(res, 200, Support);
  } catch (error) {
    logger.error(error);
		return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}
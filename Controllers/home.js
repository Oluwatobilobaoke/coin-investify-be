const { successResMsg, errorResMsg } = require('../Utils/libs/response');
const logger = require('../logger').Logger;
const {sendEmail} = require('../Utils/libs/send-mail');



const home = (req, res) => {
  res.status(200).json({ message: 'Welcome to Coin-Investify API' });
};


const contactUs = async (req, res) => {
  try {
    const { fullName, email, content, subject } = req.body;
    const data = {
      text: `Full Name: ${fullName}\n Subject: ${subject}\n Email: ${email}\n Content: ${content}`,
    };
    
    await sendEmail({
      email: process.env.COIN_INVESTIFY_TO_EMAIL,
      subject: 'Contact US Form',
      message: data.text,
    });

    console.log(data.text);
    return successResMsg(res, 200, {
      message: 'Information sent successfully',
    });
  } catch (error) {
    console.log(error.message);
    logger.error(error);
    return errorResMsg(res, 500, 'It is not you, it is us. Please try again!');
  }
};



module.exports = { home, contactUs };

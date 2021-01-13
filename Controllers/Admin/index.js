const { v4 } = require('uuid');

const { sendEmail } = require('../../Utils/libs/send-email');
const { hashPassword } = require('../../Utils/libs/password');
const { errorResMsg, successResMsg } = require('../../Utils/libs/response');
const { getUserByEmail, createUser } = require('../dao/impl/db/user');
const logger = require('../../logger').Logger;

const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.COIN_INVESTIFY_DEV_URL
    : process.env.COIN_INVESTIFY_FRONT_END_URL;

const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, password, phoneNumber, email } = req.body;

    const userExists = await getUserByEmail(email);
    if (userExists) {
      return errorResMsg(res, 401, 'Email Already Exist');
    }
    const hashedPassword = await hashPassword(password);
    const userId = v4();
    const user = {
      firstName,
      lastName,
      email,
      status: '1',
      userId,
      phoneNumber,
      roleId: 'ROL-ADMIN',
      password: hashedPassword,
    };
    await createUser(user);
    const link = `${URL}/login`;
    const options = {
      email,
      subject: 'New Coin Investify Staff Account Details',
      message: `<h5>Login Credentials<h5>
                  <p>Email: ${email}<p>
                  <p>Password: ${password}<p>
                  Click <a href=${link}>here</a> to login`,
    };
    await sendEmail(options);
    const dataInfo = { message: 'Admin Created Successfully!' };
    successResMsg(res, 201, dataInfo);
  } catch (err) {
    logger.error(err);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
  return false;
};

module.exports =  {
  createAdmin,
}

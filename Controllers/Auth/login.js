/* eslint-disable consistent-return */
const { signJWT } = require('../../Utils/libs/token');
const { comparePassword } = require('../../Utils/libs/password');

const {
  getUserByEmail,
  updateUser,
  updateActivityTracking,
  getUserByloginToken,
} = require('../dao/impl/db/user');
const { trackLogin } = require('../dao/impl/db/tracking');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const { getIp } = require('../../Utils/libs/get-Ip');
// const Role = require('../../Middleware/role');
const redisKeys = require('../dao/impl/redis/redis-key-gen');
const logger = require('../../logger').Logger;

const { sendEmail } = require('../../Utils/libs/send-mail');


const Cache = require('../../Utils/libs/cache');

const cache = new Cache();

const returnUser = async (req, res, email, password, user) => {
  try {
    // let isEmployer = false;

    // if (user && user.roleId === Role.Employer) {
    //   isEmployer = true;
    //   const employer = await getEmployer(user.userId);
    //   if (employer) {
    //     verificationStatus = employer.verificationStatus;
    //   }
    // }

    // TODO: uncomment line 35 - 49 when email has been resolved, same with line 17
    // if (user.status === '0') {
    //   if (user.roleId === Role.Employee)
    //     return errorResMsg(
    //       res,
    //       401,
    //       'User is not verified! Complete email verification to continue.'
    //     );
    //   const userSubscription = await getUserSubscription(user.userId);
    //   if ((userSubscription && userSubscription.plan === 'free') || !userSubscription)
    //     return errorResMsg(
    //       res,
    //       401,
    //       'User is not verified! Complete email verification to continue.'
    //     );
    // }

    if (user.block) {
      return errorResMsg(
        res,
        401,
        'User Blocked! Please contact an administrator.'
      );
    }

    // Decrypting User Password
    const valid = comparePassword(password, user.password);
    // If password is correct
    if (valid) {
      let data = {
        userId: user.userId.toString(),
        email: user.email,
        userRole: user.roleId,
      };

      // SET sign in location and time
      const currentUser = await getUserByEmail(email);
      const lastLoginIp = currentUser.dataValues.currentSignInIp;
      console.log(`here is lastloginIp: ${lastLoginIp}`);
      const ipAddress = getIp(req);
      console.log('here is the ip address', ipAddress)  //TODO Dont forget to remove this line in production

      if ((lastLoginIp !== ipAddress && currentUser.signInCount == 0) || (lastLoginIp !== ipAddress)) {
          try {
            

          const generateLoginToken = () => {
              const loginToken = Math.floor(100000 + Math.random() * 900000);
               
               // Set expire
             const loginTokenExpire = Date.now() + 30 * 60 * 1000;
             return {loginToken, loginTokenExpire}
           }
            
           const {
            loginToken,
            loginTokenExpire,
          } = generateLoginToken();
      
          await updateUser({ email }, { loginToken, loginTokenExpire });


            // Create Login Token 
            const loginTokenMessage = `${loginToken}`;

            await sendEmail({
              email,
              subject: 'Coin-Investify Login Code',
              message: `
                Hello ${currentUser.dataValues.firstName}, We detected a login attempt from this ip address, ${ipAddress}, here is 6 verification code
                ${loginTokenMessage}`
            });
            console.log('Broski is it you??, why are you using another person\'s ride', loginToken);
            return successResMsg(res, 201, { message: 'Login Token has been sent to your email' });
          } catch (error) {
            logger.error(error);
            return errorResMsg(res, 500, 'it is us, not you. Please try again');
          }
      }


      await updateActivityTracking(currentUser, ipAddress);

      const date = new Date();

      // Track Login
      const dataToTrack = {
        userId: currentUser.userId,
        signInDate: date,
        signInIp: ipAddress,
      };

      await trackLogin(dataToTrack);

      const token = signJWT(data);

      // set cache if not set
      const keyId = redisKeys.getHashKey(`email:${email.toString()}`);
      const userCacheData = await cache.get(keyId); // fetch from cache
      if (!userCacheData) await cache.set(keyId, user); // set email data to cache

      const dataInfo = { message: 'Login Successful!', token };
      return successResMsg(res, 200, dataInfo);
    }
    // In the event of a wrong password
    return errorResMsg(res, 400, 'Email or password incorrect!');
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'Something went wrong');
  }
};


const verifyLogin = async (req, res) => {
  const { loginToken } = req.body

  try {
    const user = await getUserByloginToken(loginToken);
    // console.log(user.email);
  if (!user) {
    return errorResMsg(res, 400, 'Invalid token');
  }

  if (user.dataValues.loginTokenExpire < Date.now()) {
    return errorResMsg(res, 400, 'Login token has expired');
  }
  // Set records
  user.loginToken = null;
  user.loginTokenExpire = null;
  await user.save();


  // SET sign in location and time
  const currentUser = await getUserByEmail(user.email);
  const ipAddress = getIp(req);
  await updateActivityTracking(currentUser, ipAddress);

  const date = new Date();

  // Track Login
  const dataToTrack = {
    userId: currentUser.userId,
    signInDate: date,
    signInIp: ipAddress,
  };

  await trackLogin(dataToTrack);

  let data = {
    userId: user.userId.toString(),
    email: user.email,
    userRole: user.roleId,
  };

  // console.log(data);
  
  const token = signJWT(data);

      // // set cache if not set
      // const keyId = redisKeys.getHashKey(`email:${email.toString()}`);
      // const userCacheData = await cache.get(keyId); // fetch from cache
      // if (!userCacheData) await cache.set(keyId, user); // set email data to cache

      const dataInfo = { message: 'Login Attempt Verified Successfully!', token };
      return successResMsg(res, 200, dataInfo);
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'Something went wrong');
  }

};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const keyId = redisKeys.getHashKey(`email:${email.toString()}`);

    const data = await cache.get(keyId); // fetch from cache
    if (!data) {
      const userData = await getUserByEmail(email);
      if (userData) {
        const user = userData.dataValues;
        return returnUser(req, res, email, password, user);
      }
      return errorResMsg(res, 401, 'Email or password incorrect');
    }
    return returnUser(req, res, email, password, data);
  } catch (error) {
    logger.error(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

module.exports = {
  login,
  verifyLogin,
};

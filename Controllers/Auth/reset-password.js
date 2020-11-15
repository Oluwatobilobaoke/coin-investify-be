const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {
  getUserByEmail,
  updateUser,
  getUserByResetPasswordToken,
} = require('../dao/impl/db/user');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const { signJWT } = require('../../Utils/libs/token');
const {
  registerEmailContent,
} = require('../../Utils/libs/email-templates/user-registration-email-template');

const logger = require('../../logger').Logger;
const {
  forgotPasswordEmailContent,
} = require('../../Utils/libs/email-templates/forgot-password-template');
const redisKeys = require('../dao/impl/redis/redis-key-gen');
const Cache = require('../../Utils/libs/cache');
const { sendEmail } = require('../../Utils/libs/send-mail');
const {
  emailAlreadyRegistered,
} = require('../../Utils/libs/email-templates/user-already-verified-email-template');

const cache = new Cache();

const URL =
  process.env.NODE_ENV === 'development'
    ? process.env.COIN_INVESTIFY_DEV_URL
    : process.env.COIN_INVESTIFY_FRONT_END_URL;

/**
 * Generate reset password token
 * @returns {object} response object
 */
const getResetPasswordToken = () => {
  // Generate token
  const resetToken = crypto.randomBytes(20)
  .toString('hex');

  // Hash token and set to resetPasswordToken field
  const resetPasswordToken = crypto
  .createHash('sha256')
  .update(resetToken, 'utf8')
  .digest('hex');

  // Set expire
  const resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return { resetToken, resetPasswordToken, resetPasswordExpire };
};

/**
 * User's password reset request
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} custom response
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user)
      return successResMsg(res, 201, { message: 'Reset password email sent' });

    const {
      resetToken,
      resetPasswordToken,
      resetPasswordExpire,
    } = getResetPasswordToken();

    await updateUser({ email }, { resetPasswordToken, resetPasswordExpire });

    // Create reset url
    const resetUrl = `${URL}/new-password/?confirmationToken=${resetToken}`;

    await sendEmail({
      email,
      subject: 'Coin-Investify Password reset token',
      message: await forgotPasswordEmailContent(
        user.dataValues.firstName,
        resetUrl
      ),
    });
    return successResMsg(res, 201, { message: 'Reset password email sent' });
  } catch (error) {
    logger.log(error);
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

/**
 * Resets a user's password
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} custom response
 */
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const { resettoken: confirmationToken } = req.params;
    const { password } = req.body;
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(confirmationToken, 'utf8')
    .digest('hex');

    const user = await getUserByResetPasswordToken(resetPasswordToken);

    if (!user) {
      return errorResMsg(res, 400, 'Invalid token');
    }

    if (user.dataValues.resetPasswordExpire < Date.now()) {
      return errorResMsg(res, 400, 'Reset password token expired');
    }

    // hash password before saving
    const salt = bcrypt.genSaltSync(10);

    // Set new password
    user.password = bcrypt.hashSync(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    const keyId = redisKeys.getHashKey(`email:${user.email.toString()}`);
    await user.save();
    await cache.set(keyId, user); // update user in cache

    const data = { message: 'Password changed successfully' };
    return successResMsg(res, 200, data);
  } catch (err) {
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

/**
 * Resend verification link
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} custom response
 */
  // eslint-disable-next-line consistent-return
const resendVerificationLink = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await getUserByEmail(email);
      if (!user)
        successResMsg(res, 201, { message: 'Verification email re-sent!' });

      if (user.status === '1') {
        // delete cache of user and set again
        const keyId = redisKeys.getHashKey(`email:${user.email.toString()}`);
        await cache.del(keyId);
        await cache.set(keyId, user);
        const loginUrl = `${URL}/login`;

        await sendEmail({
          email,
          subject: 'Coin Investify Successful Email Verification',
          message: await emailAlreadyRegistered(user.firstName, loginUrl),
        });

        return successResMsg(res, 201, {
          message: 'Verification email re-sent!',
        });
      }
      const userData = {
        email,
      };
      // Generate new verification token
      const token = signJWT(userData);

      const verificationUrl = `${URL}/auth/email/verify/?verification_token=${token}`;

      await sendEmail({
        email,
        subject: 'Coin Investify Email Verification',
        message: await registerEmailContent(user.firstName, verificationUrl),
      });

      successResMsg(res, 201, { message: 'Verification email re-sent!' });
    } catch (error) {
      logger.log(error);
      return errorResMsg(
        res,
        500,
        'An error occurred while trying to resend verification link'
      );
    }
  };
module.exports = {
  forgotPassword,
  resetPassword,
  resendVerificationLink,
};

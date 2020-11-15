const express = require('express');

const {
  investorRegistration
} = require('../../Controllers/Auth/register');

const { verifyEmail } = require('../../Controllers/auth/verify-email');

const {
  resetPassword,
  forgotPassword,
  resendVerificationLink,
} = require('../../Controllers/auth/reset-password');

const { 
	UserValidation
} = require('../../Utils/validators/auth/index');

const router = express.Router();

router.post(
  '/register/',
  UserValidation.validateInvestor,
  investorRegistration
);


router.get('/email/verify', verifyEmail);
router.put(
  '/email/verify/resend',
  UserValidation.resendVerificationLink,
  resendVerificationLink
);

router.post(
  '/password/reset',
  UserValidation.resendVerificationLink,
  forgotPassword
);
router.put(
  '/password/reset/:resettoken',
  UserValidation.resetPassword,
  resetPassword
);



module.exports.authRouter = router;

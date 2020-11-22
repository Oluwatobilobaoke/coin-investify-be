const express = require('express');

const {
  investorRegistration
} = require('../../Controllers/Auth/register');

const { login } = require('../../Controllers/Auth/login');

const {verifyLogin} = require('../../Controllers/Auth/login');

const { verifyEmail } = require('../../Controllers/Auth/verify-email');

const {
  resetPassword,
  forgotPassword,
  resendVerificationLink,
} = require('../../Controllers/Auth/reset-password');

const { 
	UserValidation
} = require('../../Utils/validators/auth/index');

const router = express.Router();

router.post(
  '/register/',
  UserValidation.validateInvestor,
  investorRegistration
);

router.post('/login', UserValidation.validateLogin, login);
router.put('/login/verify', verifyLogin)

router.get('/email/verify', verifyEmail);
router.post(
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

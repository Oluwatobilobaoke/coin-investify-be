/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
const Joi = require('joi');
const Format = require('../index');
const validator = require('../validator');

class UserValidation {
	static validateInvestor(req, res, next) {
		const format = Joi.object().keys(
			{
				firstName: Format.firstName,
				lastName: Format.lastName,
				// country: Format.text,
				// phoneNumber: Format.phoneNo,
				email: Format.email,
        password: Format.password,
        referrerCode: Format.textOptional
				// btcWallet: Format.textOptional,
			},
			{}
		);
		validator(format, req.body, res, next);
  }
  
	static validateInvestorProfileUpdate(req, res, next) {
		const format = Joi.object().keys(
			{
				firstName: Format.textOptional,
				lastName: Format.textOptional,
				country: Format.textOptional,
				// phoneNumber: Format.phoneNo,
				// email: Format.email,
        btcWalletAddress: Format.textOptional,
			},
			{}
		);
		validator(format, req.body, res, next);
	}

	static validateLogin(req, res, next) {
		const format = Joi.object().keys(
			{
				email: Format.email,
				password: Format.text,
			},
			{}
		);
		validator(format, req.body, res, next);
	}

	static checkEmailAndPhoneNumber (req, res, next) {
    const format = Joi.object().keys(
      {
        email: Format.email,
        phoneNumber: Format.phoneNo,
      },
      {}
    );
    validator(format, req.body, res, next);
  }

	static resendVerificationLink(req, res, next) {
    const format = Joi.object().keys(
      {
        email: Format.email,
      },
      {}
    );
    validator(format, req.body, res, next);
  }

  static updatePassword(req, res, next) {
    const format = Joi.object().keys(
      {
        oldPassword: Format.password,
        newPassword: Format.password,
      },
      {}
    );
    validator(format, req.body, res, next);
  }

  static resetPassword(req, res, next) {
    const format = Joi.object().keys(
      {
        password: Format.password,
      },
      {}
    );
    validator(format, req.body, res, next);
	}
	
	static validateAdmin(req, res, next) {
    const format = Joi.object().keys(
      {
        firstName: Format.firstName,
        lastName: Format.lastName,
        phoneNumber: Format.phoneNo,
        email: Format.email,
        password: Format.password,
      },
      {}
    );
    validator(format, req.body, res, next);
  }

  static validateEmail(req, res, next) {
    const format = Joi.object().keys(
      {
        email: Format.email,
      },
      {}
    );
    validator(format, req.body, res, next);
  }
}

module.exports.UserValidation = UserValidation;
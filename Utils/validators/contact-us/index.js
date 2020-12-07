const Joi = require('joi');
const Format = require('../index');
const validator = require('../validator');

class ContactUsValidation {
  static validateMessage(req, res, next) {
    const format = Joi.object().keys(
      {
        email: Format.email,
        subject: Format.text,
        fullName: Format.text,
        content: Format.text,
      },
      {}
    );
    validator(format, req.body, res, next);
  }
}

module.exports.ContactUsValidation = ContactUsValidation;

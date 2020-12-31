const Joi = require('joi');
const Format = require('../index');
const validator = require('../validator');

class SupportValidation {
  static ticketCreation(req, res, next) {
    const format = Joi.object().keys(
      {
        email: Format.email,
        typeOfSupport: Format.text,
        email: Format.email,
        name: Format.nameOptional,
        subject: Format.text,
        description: Format.text,
        statusOfSupportTicket: Format.text,
        supportId: Format.text,
        attachment: Format.text,
        priority: Format.text,
        userId: Format.text,
      },
      {}
    );
    validator(format, req.body, res, next);
  }
}

module.exports.SupportValidation = SupportValidation;

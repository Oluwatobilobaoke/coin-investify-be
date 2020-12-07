const Joi = require('joi');
const Format = require('../index');
const validator = require('../validator');

class WithdrawalValidation {
  static validateWithdrawal (req, res, next) {
    const format = Joi.object()
    .keys(
      {
        userId: Format.text,
        coinType: Format.textOptional,
        amount: Format.number,
        WalletAddress: Format.text,
      },
      {}
    );
    validator(format, req.body, res, next);
  }
}

module.exports.WithdrawalValidation = WithdrawalValidation;

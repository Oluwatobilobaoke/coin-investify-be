const { errorResMsg } = require('../libs/response');
require('joi');

// eslint-disable-next-line consistent-return
module.exports = async (schema, toValidate, res, next) => {
  const options = {
    errors: {
      wrap: {
        label: '',
      }
    },
    abortEarly: false,
    presence: 'required',
  }
  try {
    await schema.validateAsync(toValidate, options)
    next()
  } catch (error) {
    const errors = {};
    for (const item of error.details)
      errors[item.path[0]] = item.message;
    return errorResMsg(res, 400, errors)
  }
}

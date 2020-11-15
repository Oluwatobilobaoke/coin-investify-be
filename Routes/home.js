const express = require('express');
const { home } = require('../Controllers/home');

// const { ContactUsValidation } = require('../Utils/validators/contact-us/index');

const index = express.Router();

index.get('/', home);
// index.post('/contact-us', ContactUsValidation.validateMessage, contactUs);

module.exports.index = index;

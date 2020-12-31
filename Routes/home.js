const express = require('express');
const Role = require('../Middleware/role');

const { home, contactUs } = require('../Controllers/home');
const {
	createTicket,
	getAllUserTicket,
	getSupportTicket,
} = require('../Controllers/support')


const { ContactUsValidation } = require('../Utils/validators/contact-us/index');
const { SupportValidation } = require('../Utils/validators/support/index');
const multerInstance = require('../Utils/libs/multer');
const { authorize } = require('../Middleware');

const getId = (req, res, next) => {
  const { userId } = req.user;
  req.params.userId = userId;
  next();
};

const index = express.Router();

index.get('/', home);
index.post('/contact-us', ContactUsValidation.validateMessage, contactUs);

// Support
index.post('/ticket', multerInstance.upload.single('attachment'), authorize(), getId, createTicket);
index.get('/ticket', authorize(Role.Investor), getId, getAllUserTicket);
index.get('/ticket/:supportId', authorize(Role.Investor), getId, getSupportTicket);

module.exports.index = index;

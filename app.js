const express = require('express');
const chalk = require('chalk');

const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv');

const { key } = require('./Utils/libs/gen-key');

dotenv.config();

process.env.COIN_INVESTIFY_SESSION_COOKIEKEY = key(64);
const db = require('./models');

// Routes calls
const { seedSuperAdmin } = require('./Utils/libs/seed');
const { index } = require('./Routes/home');
const { activityRouter } = require('./Routes/activity/index')
const { authRouter } = require('./Routes/Auth/index');
const { investorRouter } = require('./Routes/Investor/index');

// Routes calls end
const { errorHandler } = require('./Middleware/error-handler');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
db.sequelize.sync().then(async () => {
  await seedSuperAdmin();
});

// ************ REGISTER ROUTES HERE ********** //
app.use('/v1', index);
app.use('/v1/activity', activityRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/investor', investorRouter);

// ************ END ROUTE REGISTRATION ********** //

// global error handler
app.use(errorHandler);

module.exports = app;
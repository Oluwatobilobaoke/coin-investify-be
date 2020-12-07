/* eslint-disable consistent-return */
const { getDashboard } = require('../dao/impl/db/investor');
const { successResMsg, errorResMsg } = require('../../Utils/libs/response');
const { investorDashboardCache } = require('../../Utils/libs/dashboard-cache');
const logger = require('../../logger').Logger;

const attributes = [
  'userId',
  'firstName',
  'lastName',
  'email',
  'walletBalance',
  'currentSignInOn',
  'LastSignInOn',
  'currentSignInIp',
  'LastSignInIp',
];

const investorDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    let dashboard;

    const cacheData = await investorDashboardCache(userId);
    if (!cacheData) {
      dashboard = await getDashboard(userId, attributes);
      if (dashboard.activities && dashboard.activities.length > 1) dashboard.activities.reverse();
      return successResMsg(res, 200, dashboard);
    }
    dashboard = cacheData;
    if (dashboard.activities && dashboard.activities.length > 1) dashboard.activities.reverse();
    return successResMsg(res, 200, dashboard);
  } catch (err) {
    logger.error(JSON.stringify(err));
    return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
};

module.exports = {
  dashboard: investorDashboard,
};

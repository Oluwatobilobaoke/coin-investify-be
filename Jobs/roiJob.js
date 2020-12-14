const cron = require("node-cron");

const { sendEmail } = require('../Utils/libs/send-mail');
const { successResMsg, errorResMsg } = require('../Utils/libs/response');
const logger = require('../logger').Logger;
const model = require('../models');

const {
	updateDeposit,
} = require('../Controllers/dao/impl/db/deposit');

const {
	updateInvestorUserData,
	getUserById,
} = require('../Controllers/dao/impl/db/user');

const roiPerDayCron = async () => {
  try {

	cron.schedule('59 */24 * * 1-5', async () => {
		const activeInvestments = await model.Deposit.findAll({
			where: {
				isActive: true,
			}
		});

		for (const activeInvestment of activeInvestments) {
			const { accruedInterest, interestPerDay, daysLeftToMature, userId } = activeInvestment;

			const currentAccruedEarnings =  accruedInterest + interestPerDay;

			const investmentDaysLeft = daysLeftToMature--;

			const activeInvestmentData = {
				accruedInterest: currentAccruedEarnings,
				daysLeftToMature: investmentDaysLeft,
			};

			await updateDeposit({userId}, activeInvestmentData);

		};



		console.log('Running At minute 59 past every 24th hour on every day-of-week from Monday through Friday.');
		});
        
  } catch (error) {
    logger.error(error);
      return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

const initiateRemittance = async () => {
  try {

	cron.schedule('10 */24 * * 1-5', async () => {
		const activeInvestments = await model.Deposit.findAll({
			where: {
				isActive: true,
				daysLeftToMature: 0,
			}
		});

		for (const activeInvestment of activeInvestments) {
			const mailingList = [];
			
			const { accruedInterest, amountInUsd, userId } = activeInvestment;

			const totalEarned =  accruedInterest + amountInUsd;

			const activeInvestmentData = {
				isActive: false,
			};

			const userWalletBalUpdate = {
				walletBalance: totalEarned,
			};

			await updateDeposit({userId}, activeInvestmentData);
			await updateInvestorUserData(userWalletBalUpdate, userId);
			const user = getUserById(userId);

			mailingList.push(user.email);
			 
			await sendEmail({
				email,
				subject: 'Coin-Investify Maturity Notification',
				message: `Hello, ${user.firstName}, your investment has matured`,
			})			

		};

		// TODO Create CRON to notify client of their Maturity, send data of the maturity 3 prior to maturity



		console.log('Running At minute 59 past every 24th hour on every day-of-week from Monday through Friday.');
		});
        
  } catch (error) {
    logger.error(error);
      return errorResMsg(res, 500, 'it is us, not you. Please try again');
  }
}

module.exports = {
	roiPerDayCron,
	initiateRemittance,
};
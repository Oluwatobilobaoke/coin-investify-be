const model = require('../../../../models');
const moments = require('moment-business-days');
const moment = require('../../../../Utils/momentjs-business-master/momentjs-business.js');

const interestRate = process.COIN_INVESTIFY_INVESTMENT_PERCENTAGE / process.env.COIN_INVESTIFY_INVESTMENT_DAYS;
console.log(interestRate);
module.exports = {
  getADepositById: async (depositId) => {
    return model.Deposit.findOne({ where: { depositId } });
  },
  getDepositByCoinbaseCode: async (txnCode) => {
    return model.Deposit.findOne({ where: { txnCode } });
  },
  getAllDepositsFromSingleUser: async (userId, attributes, limit, offset) => {
    return model.Deposit.findAndCountAll({
      where: {
         userId 
        },
        limit,
        offset,
        attributes,
      });
  },
  createDeposit: async (data) => {
    return model.Deposit.create(data);
  },
  // getInvestorWithAttributes: async (attributesTalents) => {
  //   return model.Deposit.findAll({
  //     // TODO: bring line 19 back when email for email verification is settled
  //     // where: { status: '1', roleId: 'ROL-EMPLOYEE' },
  //     where: { roleId: 'ROL-INVESTOR' },
  //     attributes: attributesTalents,
  //   });
  // },
  updateDepositStatus: async (txnCode, status) => {
    return model.Deposit.update({ DepositStatus: status }, { where: { txnCode } });
  },

  
  updateDepositDateStatus: async (txnCode, date) => {
    const dateOnly = date.slice(0,10);
    let formattedDate = dateOnly.getDate() + "-" + (dateOnly.getMonth() + 1) + "-" + dateOnly.getFullYear();
    console.log('dateonly, FormattedDate', dateOnly, formattedDate);
    const dateToMature = moments(formattedDate, 'DD-MM-YYYY').nextBusinessDay(26)._d;
    console.log('matureDAte', dateToMature);
    const dateToMature2 = moments(formattedDate, 'DD-MM-YYYY').nextBusinessDay(26)._d;
    console.log('matureDAte2', dateToMature2);
    return model.Deposit.update({ dateConfirmed: date, matureDate: dateToMature, isActive: true, daysLeftToMature: 26 }, { where: { txnCode } });
  },

  updateInterestPerday: async (txnCode, amountInUsd) => {
    const interestPerDay = amountInUsd * interestRate;
    return model.Deposit.update({ interestPerDay }, { where: { txnCode }});
  },

  updateDeposit: async (clause, data) => {
    return model.Deposit.update({ ...data }, { where: { ...clause } });
  },
  updateInvestorDepositData: async (data, depositId) => {
    return model.Deposit.update(data, { where: { depositId } });
  },
  getAllDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			limit,
			offset,
		});
	},
	getAllSuccessfullDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			where: {
				DepositStatus: 'Approved'
			},
			limit,
			offset,
		});
	},
	getAllPendingDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			where: {
				DepositStatus: 'Pending'
			},
			limit,
			offset,
		});
	},
	getAllDisapprovedDeposits: async (limit, offset) => {
    return model.Deposit.findAndCountAll({
			where: {
				DepositStatus: 'Cancelled'
			},
			limit,
			offset,
		});
  },
  deleteDepositById: async (depositId) => {
    return model.Deposit.destroy({ where: { depositId } });
  },
  getDepositAttributes: async (depositId, attributes) => {
    return model.Deposit.findOne({ where: { depositId }, attributes });
  },
  getAllTalents: async (attributes) => {
    return model.Deposit.findAll({
      // TODO: bring line 74 back when email for email verification is settled
      // where: { status: '1', roleId: 'ROL-EMPLOYEE', profileCreated: true },
      where: { roleId: 'ROL-EMPLOYEE', profileCreated: true },
      attributes,
    });
  },
};

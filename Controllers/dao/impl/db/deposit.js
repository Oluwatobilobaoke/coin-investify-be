const model = require('../../../../models');
const moment = require('moment-business-days');

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
    const dateToMature = moment(date, 'YYYY-MM-DD').nextBusinessDay(25)._d;
    return model.Deposit.update({ dateConfirmed: date, matureDate: dateToMature }, { where: { txnCode } });
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

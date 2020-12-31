const model = require('../../../../models');

module.exports = {
  getAWithdrawalById: async (withdrawalId) => {
    return model.Withdrawal.findOne({ where: { withdrawalId } });
  },
  getTransactions: async (userId) => {
    model.Withdrawal.findAndCountAll({
      where: {
        userId 
       },
       limit,
       offset,
       attributes,
       include: [{
         model:Deposit, 
       }]
     });
  },
  getAllWithdrawalsFromSingleUser: async (userId, attributes, limit, offset) => {
    return model.Withdrawal.findAndCountAll({
      where: {
         userId 
        },
        limit,
        offset,
        attributes,
      });
  },
  createWithdrawal: async (data) => {
    return model.Withdrawal.create(data);
  },
  // getInvestorWithAttributes: async (attributesTalents) => {
  //   return model.Withdrawal.findAll({
  //     // TODO: bring line 19 back when email for email verification is settled
  //     // where: { status: '1', roleId: 'ROL-EMPLOYEE' },
  //     where: { roleId: 'ROL-INVESTOR' },
  //     attributes: attributesTalents,
  //   });
  // },
  updateWithdrawalStatus: async (withdrawalId) => {
    return model.Withdrawal.update({ withdrawalStatus: 'Successfull' }, { where: { withdrawalId } });
  },

  cancelWithdrawalStatus: async (withdrawalId) => {
    return model.Withdrawal.update({ withdrawalStatus: 'Cancelled' }, { where: { withdrawalId } });
  },
  updateWithdrawal: async (clause, data) => {
    return model.Withdrawal.update({ ...data }, { where: { ...clause } });
  },
  updateInvestorWithdrawalData: async (data, WithdrawalId) => {
    return model.Withdrawal.update(data, { where: { withdrawalId } });
  },
  getAllWithdrawals: async (limit, offset) => {
    return model.Withdrawal.findAndCountAll({
			limit,
			offset,
		});
	},
	getAllSuccessfullWithdrawals: async (limit, offset) => {
    return model.Withdrawal.findAndCountAll({
			where: {
				withdrawalStatus: 'Successfull'
			},
			limit,
			offset,
		});
	},
	getAllProcessingWithdrawals: async (limit, offset) => {
    return model.Withdrawal.findAndCountAll({
			where: {
				withdrawalStatus: 'Processing'
			},
			limit,
			offset,
		});
	},
	getAllDisapprovedWithdrawals: async (limit, offset) => {
    return model.Withdrawal.findAndCountAll({
			where: {
				withdrawalStatus: 'Disapproved'
			},
			limit,
			offset,
		});
  },
  deleteWithdrawalById: async (WithdrawalId) => {
    return model.Withdrawal.destroy({ where: { withdrawalId } });
  },
  getWithdrawalAttributes: async (withdrawalId, attributes) => {
    return model.Withdrawal.findOne({ where: { withdrawalId }, attributes });
  },
  getAllTalents: async (attributes) => {
    return model.Withdrawal.findAll({
      // TODO: bring line 74 back when email for email verification is settled
      // where: { status: '1', roleId: 'ROL-EMPLOYEE', profileCreated: true },
      where: { roleId: 'ROL-EMPLOYEE', profileCreated: true },
      attributes,
    });
  },
};

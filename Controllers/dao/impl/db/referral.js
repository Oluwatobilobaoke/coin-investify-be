const model = require('../../../../models');

module.exports = {
  getAReferralById: async (ReferralId) => {
    return model.Referral.findOne({ where: { ReferralId } });
  },
  getReferralByUserId: async (userId) => {
    return model.Referral.findOne({ where: { userId } });
  },
  getAllReferralsFromSingleUser: async (userId, attributes, limit, offset) => {
    return model.Referral.findAndCountAll({
      where: {
         userId 
        },
        limit,
        offset,
        attributes,
      });
  },
  createReferral: async (data) => {
    return model.Referral.create(data);
  },
  // getInvestorWithAttributes: async (attributesTalents) => {
  //   return model.Referral.findAll({
  //     // TODO: bring line 19 back when email for email verification is settled
  //     // where: { status: '1', roleId: 'ROL-EMPLOYEE' },
  //     where: { roleId: 'ROL-INVESTOR' },
  //     attributes: attributesTalents,
  //   });
  // },
  updateReferralStatus: async (ReferralId) => {
    return model.Referral.update({ ReferralStatus: 'Successfull' }, { where: { ReferralId } });
  },
  updateReferral: async (clause, data) => {
    return model.Referral.update({ ...data }, { where: { ...clause } });
  },
  updateInvestorReferralData: async (data, ReferralId) => {
    return model.Referral.update(data, { where: { ReferralId } });
  },
  getAllReferrals: async (limit, offset) => {
    return model.Referral.findAndCountAll({
			limit,
			offset,
		});
	},
	getAllSuccessfullReferrals: async (limit, offset) => {
    return model.Referral.findAndCountAll({
			where: {
				ReferralStatus: 'Approved'
			},
			limit,
			offset,
		});
	},
	getAllPendingReferrals: async (limit, offset) => {
    return model.Referral.findAndCountAll({
			where: {
				ReferralStatus: 'Pending'
			},
			limit,
			offset,
		});
	},
	getAllDisapprovedReferrals: async (limit, offset) => {
    return model.Referral.findAndCountAll({
			where: {
				ReferralStatus: 'Cancelled'
			},
			limit,
			offset,
		});
  },
  deleteReferralById: async (ReferralId) => {
    return model.Referral.destroy({ where: { ReferralId } });
  },
  getReferralAttributes: async (ReferralId, attributes) => {
    return model.Referral.findOne({ where: { ReferralId }, attributes });
  },
  getAllTalents: async (attributes) => {
    return model.Referral.findAll({
      // TODO: bring line 74 back when email for email verification is settled
      // where: { status: '1', roleId: 'ROL-EMPLOYEE', profileCreated: true },
      where: { roleId: 'ROL-EMPLOYEE', profileCreated: true },
      attributes,
    });
  },
};

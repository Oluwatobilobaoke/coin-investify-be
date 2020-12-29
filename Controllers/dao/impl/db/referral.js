const model = require('../../../../models');

module.exports = {
  getAReferralById: async (referralId) => {
    return model.Referral.findOne({ where: { referralId }, attributes: ['referralCount', 'referralEarnings'] });
  },
  getReferralByUserId: async (userId) => {
    return model.Referral.findOne({ where: { userId }, attributes: ['referralCount', 'referralEarnings'] });
  },
  getAllReferralsFromSingleUser: async (referrer, attributes, limit, offset) => {
    return model.User.findAndCountAll({
      where: {
        referrer, 
        },
        limit,
        offset,
        attributes,
      });
  },
  createReferral: async (data) => {
    return model.Referral.create(data);
  },
  updateReferralActivity: async (referralInstance) => {
    const referral = referralInstance;
    referral.referralCount += 1;

    referral.save();
  },
  updateReferralStatus: async (referralId) => {
    return model.Referral.update({ ReferralStatus: 'Successfull' }, { where: { referralId } });
  },
  updateReferral: async (clause, data) => {
    return model.Referral.update({ ...data }, { where: { ...clause } });
  },
  updateInvestorReferralData: async (data, referralId) => {
    return model.Referral.update(data, { where: { referralId } });
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
  deleteReferralById: async (referralId) => {
    return model.Referral.destroy({ where: { referralId } });
  },
  getReferralAttributes: async (referralId, attributes) => {
    return model.Referral.findOne({ where: { referralId }, attributes });
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

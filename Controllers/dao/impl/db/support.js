const model = require('../../../../models');

module.exports = {
  getSupportByEmail: async (email) => {
    return model.Support.findOne({ where: { email } });
  },
  getSupportById: async (SupportId) => {
    return model.Support.findOne({ where: { supportId } });
  },
  getSupportByPhoneNumber: async (phoneNumber) => {
    return model.Support.findOne({ where: { phoneNumber } });
  },
  createSupport: async (data) => {
    return model.Support.create(data);
  },
  getAllSupportsFromSingleUser: async (userId, attributes, limit, offset) => {
    return model.Support.findAndCountAll({
      where: {
         userId 
        },
        limit,
        offset,
        attributes,
      });
  },
  getSupportIpAddress: async (email) => {
    return model.Support.findOne({ where: { LastSignInIp }})
  },
  updateSupportStatus: async (email) => {
    return model.Support.update({ status: '1' }, { where: { email } });
  },
  updateSupport: async (clause, data) => {
    return model.Support.update({ ...data }, { where: { ...clause } });
  },
  updateSupportData: async (data, SupportId) => {
    return model.Support.update(data, { where: { SupportId } });
  },
  getSupportByUserId: async (SupportId) => {
    return model.Support.findOne({ where: { userId } });
  },
  deleteSupportById: async (SupportId) => {
    return model.Support.destroy({ where: { SupportId } });
  },
  getSupportByResetPasswordToken: async (resetPasswordToken) => {
    return model.Support.findOne({
      where: {
        resetPasswordToken,
      },
    });
  },
  getSupportByloginToken: async (loginToken) => {
    return model.Support.findOne({
      where: {
        loginToken,
      },
    });
  },
  getSupportAttributes: async (supportId, attributes) => {
    return model.Support.findOne({ where: { supportId }, attributes });
  },
  allowShare: async (SupportId) => {
    return model.Support.update(
      { profileSharingAllowed: true },
      { where: { SupportId } }
    );
  },
  disableShare: async (SupportId) => {
    return model.Support.update(
      { profileSharingAllowed: false },
      { where: { SupportId } }
    );
  },
  getAllTalents: async (attributes) => {
    return model.Support.findAll({
      // TODO: bring line 74 back when email for email verification is settled
      // where: { status: '1', roleId: 'ROL-EMPLOYEE', profileCreated: true },
      where: { roleId: 'ROL-EMPLOYEE', profileCreated: true },
      attributes,
    });
  },
  contactUs: async (data) => {
    return model.Contact.create(data);
  },
};

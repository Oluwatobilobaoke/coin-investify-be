const model = require('../../../../models');

module.exports = {
  getUserByEmail: async (email) => {
    return model.User.findOne({ where: { email } });
  },
  getUserById: async (userId) => {
    return model.User.findOne({ where: { userId } });
  },
  getUserByPhoneNumber: async (phoneNumber) => {
    return model.User.findOne({ where: { phoneNumber } });
  },
  createUser: async (data) => {
    return model.User.create(data);
  },
  getInvestorWithAttributes: async (attributesTalents) => {
    return model.User.findAll({
      // TODO: bring line 19 back when email for email verification is settled
      // where: { status: '1', roleId: 'ROL-EMPLOYEE' },
      where: { roleId: 'ROL-INVESTOR' },
      attributes: attributesTalents,
    });
  },
  getUserIpAddress: async (email) => {
    return model.User.findOne({ where: { LastSignInIp }})
  },
  updateActivityTracking: async (userInstance, ipAddress) => {
    const user = userInstance;
    user.signInCount += 1;

    user.LastSignInOn = user.currentSignInOn;
    user.LastSignInIp = user.currentSignInIp;

    user.currentSignInOn = new Date();
    user.currentSignInIp = ipAddress;
    user.save();
  },
  updateUserStatus: async (email) => {
    return model.User.update({ status: '1' }, { where: { email } });
  },
  updateUser: async (clause, data) => {
    return model.User.update({ ...data }, { where: { ...clause } });
  },
  updateInvestorUserData: async (data, userId) => {
    return model.User.update(data, { where: { userId } });
  },
  getUserById: async (userId) => {
    return model.User.findOne({ where: { userId } });
  },
  deleteUserById: async (userId) => {
    return model.User.destroy({ where: { userId } });
  },
  getUserByResetPasswordToken: async (resetPasswordToken) => {
    return model.User.findOne({
      where: {
        resetPasswordToken,
      },
    });
  },
  getUserByloginToken: async (loginToken) => {
    return model.User.findOne({
      where: {
        loginToken,
      },
    });
  },
  getUserAttributes: async (userId, attributes) => {
    return model.User.findOne({ where: { userId }, attributes });
  },
  allowShare: async (userId) => {
    return model.User.update(
      { profileSharingAllowed: true },
      { where: { userId } }
    );
  },
  disableShare: async (userId) => {
    return model.User.update(
      { profileSharingAllowed: false },
      { where: { userId } }
    );
  },
  getAllInvestorUsers: async (attributes) => {
    return model.User.findAll({
      // TODO: bring line 74 back when email for email verification is settled
      // where: { status: '1', roleId: 'ROL-EMPLOYEE', profileCreated: true },
      where: { roleId: 'ROL-EMPLOYEE'},
      attributes,
    });
  },
  getAllInvestorUsers: async (attributes, limit, offset) => {
    return model.User.findAndCountAll({
      where: {
        roleId:  
        },
        limit,
        offset,
        attributes,
      });
  },
  contactUs: async (data) => {
    return model.Contact.create(data);
  },
};

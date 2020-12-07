const model = require('../../../../models/index');

module.exports = {
  getActivities: async (userId) => {
    return model.Activity.findAll({ where: { userId } });
  },
  deleteAnActivity: async (id, userId) => {
    return model.Activity.destroy({ where: { id, userId } });
  },
  createActivity: async (userId, type, message) => {
    return model.Activity.create({ userId, type, message });
  },
};

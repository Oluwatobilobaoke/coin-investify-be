const model = require('../../../../models/index');

module.exports = {
  trackLogin: async (data) => {
    return model.Tracking.create(data);
  },
};

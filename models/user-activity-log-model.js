module.exports = (sequelize, DataTypes) => {
    const ActivityLog = sequelize.define('ActivityLog', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
    
  ActivityLog.associate = (model) => {
    ActivityLog.belongsTo(model.User, { foreignKey: 'userId' });
  };
  
  return ActivityLog;
};
  
module.exports = (sequelize, DataTypes) => {
    const Tracking = sequelize.define('Tracking', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      signInDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      signInIp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    Tracking.associate = (model) => {
      Tracking.belongsTo(model.User, { foreignKey: 'userId' });
    };
  
    return Tracking;
  };
  
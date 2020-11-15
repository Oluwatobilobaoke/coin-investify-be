module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    Activity.associate = (model) => {
      Activity.belongsTo(model.User, { foreignKey: 'userId' });
    };
  
    return Activity;
  };
  
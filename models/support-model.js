module.exports = (sequelize, DataTypes) => {
    const Support = sequelize.define('Support', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      typeOfSupport: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      response: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      statusOfSupportTicket: {
        type: DataTypes.STRING(15),
        defaultValue: 'Open',
        allowNull: false,
      },
      supportId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      priority: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      userId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    });
  
    Support.associate = (model) => {
      Support.belongsTo(model.User, { foreignKey: 'userId' });
    };
  
    return Support;
  };
  
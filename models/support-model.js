module.exports = (sequelize, DataTypes) => {
    const Support = sequelize.define('Support', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['contact', 'abuse'],
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      response: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['open', 'closed'],
        defaultValue: 'open',
        allowNull: false,
      },
    });
  
    Support.associate = (model) => {
      Support.belongsTo(model.User, { foreignKey: 'userId' });
    };
  
    return Support;
  };
  
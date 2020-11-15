module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      walletId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    Wallet.associate = (model) => {
      Wallet.belongsTo(model.User, { foreignKey: 'userId' });
  
    //   Wallet.belongsTo(model.Wallet, {
    //     foreignKey: 'walletId',
    //   });
    };
  
    return Wallet;
  };
  
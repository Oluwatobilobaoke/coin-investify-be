module.exports = (sequelize, DataTypes) => {
    const Withdrawal = sequelize.define('Withdrawal', {
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
      coinType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'BTC'
      },
      WalletAddress: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Your Wallet Address'
      },
      withdrawalStatus: {
        type: DataTypes.ENUM,
        values: ['Successfull', 'Cancelled', 'Disapproved', 'Processing'],
        allowNull: false,
        defaultValue: 'Processing',
      },
      withdrawalId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    Withdrawal.associate = (model) => {
      Withdrawal.belongsTo(model.User, { foreignKey: 'userId' });
  
    //   Withdrawal.belongsTo(model.Wallet, {
    //     foreignKey: 'walletId',
    //   });
    };
  
    return Withdrawal;
  };
  
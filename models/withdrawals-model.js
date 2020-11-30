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
      withdrawalStatus: {
        type: DataTypes.ENUM,
        values: ['Successfull', 'Disapproved', 'Pending'],
        allowNull: false,
        defaultValue: 'Pending',
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
  
module.exports = (sequelize, DataTypes) => {
    const Deposit = sequelize.define('Deposit', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      depositStatus: {
        type: DataTypes.ENUM,
        values: ['Approved', 'Disapproved', 'Pending'],
        allowNull: false,
        defaultValue: 'Pending',
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateConfirmed: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      depositId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    
    Deposit.associate = (model) => {
      Deposit.belongsTo(model.User, { foreignKey: 'userId' });
  
      // Deposit.belongsTo(model.Wallet, {
      //   foreignKey: 'walletId',
      // });
    };
  
    return Deposit;
  };
  
module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('Deposit', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    depositStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Processing',
    },
    coinType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'BTC'
    },
    depositDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateConfirmed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    matureDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    },
    daysLeftToMature: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    amountInUsd: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false,
      defaultValue: 0.00,
    },
    amountInBtc: {
      type: DataTypes.DECIMAL(15,6),
      allowNull: false,
      defaultValue: 0.000,
    },
    interestPerDay: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false,
      defaultValue: 0.00,
    },
    accruedInterest: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false,
      defaultValue: 0.00,
    },
    depositId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    txnCode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '0',
    },
    addressSentTo: {
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
  
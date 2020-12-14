module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define(
    'Referral',
    {
      id: {
        allowNull: false,
      	unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      referralCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      referralId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      referralEarnings: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      },
    );
    Referral.associate = (model) => {
      Referral.belongsTo(model.User, { foreignKey: 'userId' });
    };
  
    return Referral;
  };
  
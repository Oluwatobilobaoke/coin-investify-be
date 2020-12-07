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
      referral: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      referralId: {
        type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        referralEarnings: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
      },
    );
    Referral.associate = (model) => {
      Referral.hasMany(model.User);
    };
  
    return Referral;
  };
  
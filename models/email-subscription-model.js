module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'EmailSubscription',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.INTEGER,
        },
        email: {
          type: DataTypes.STRING(250),
          allowNull: false,
          unique: true,
        },
        subscriptionStatus: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
      },
    );
  };
  
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      allowNull: false,
      defaultValue: '0',
    },
    block: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },
    country: {
      type: DataTypes.STRING(250),
      allowNull: true,
		},
		btcWallet: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    walletBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    signInCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    currentSignInOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    LastSignInOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    currentSignInIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LastSignInIp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twoFactorCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twofactorExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referralId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire: DataTypes.BIGINT,
	});
	
	User.associate = (model) => {

    User.hasMany(model.Deposit, {
      onDelete: 'cascade',
		});

		User.hasMany(model.Tracking, {
      onDelete: 'cascade',
		});
    
    User.belongsTo(model.Role, {
      foreignKey: 'roleId',
    });
    
		User.hasMany(model.ActivityLog, {
      onDelete: 'cascade',
    });

    User.hasMany(model.Activity, {
      onDelete: 'cascade',
    });
  };
  
  return User;
}
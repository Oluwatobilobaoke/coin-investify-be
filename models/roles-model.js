module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
      'Role',
      {
        id: {
          allowNull: false,
          unique: true,
          autoIncrement: true,
          type: DataTypes.INTEGER,
        },
        roleName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
      },
    );
    Role.associate = (model) => {
      Role.hasMany(model.User);
    };
  
    return Role;
  };
  
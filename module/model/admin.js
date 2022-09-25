module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      "admin",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          validate: {
            notEmpty: true,
          },
        },
        first_name: {
          type: DataTypes.STRING,
          validate:{
              notEmpty: true
          }
        },
        last_name: {
          type: DataTypes.STRING,
          validate:{
            notEmpty: true
        }
        },
        phone: {
          type: DataTypes.STRING,
          validate:{
            notEmpty: true
        }
        },
        role:{
            type:DataTypes.ENUM({
                values:["ADMIN","SUPER_ADMIN"]
            })
        }
      },
      {
        tableName: "admin",
        freezeTableName: true,
        timestamps: false,
        underscored: true,
      }
    );
  };
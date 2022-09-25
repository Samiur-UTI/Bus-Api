"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "customer",
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
    },
    {
      tableName: "customer",
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    }
  );
};

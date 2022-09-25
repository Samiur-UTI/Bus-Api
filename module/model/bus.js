"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "bus",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: true,
        },
      },
      company_name: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: true
        }
      },
      license_number: {
        type: DataTypes.STRING,
        validate:{
          notEmpty: true
      }
      },
      seats_available:{
        type:DataTypes.INTEGER,
        validate:{
          notEmpty:true
        }
      },
      image:{
        type:DataTypes.STRING,
      }
    },
    {
      tableName: "bus",
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    }
  );
};

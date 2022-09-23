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
      full_name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "admin_user_profile",
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    }
  );
};

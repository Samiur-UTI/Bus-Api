"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "bus_route_search",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: true,
        },
      },
      bus_id: {
        type: DataTypes.INTEGER,
        validate:{
            notEmpty: true
        }
      },
      dep: {
        type: DataTypes.DATE,
        validate:{
            notEmpty: true
        }
      },
      arr: {
        type: DataTypes.DATE,
        validate:{
            notEmpty: true
        }
      },
      trip_status:{
        type:DataTypes.ENUM({
            values:["OFF","ON"]
        }),
      }
    },
    {
      tableName: "bus_route_search",
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    }
  );
};

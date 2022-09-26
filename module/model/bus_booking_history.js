"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "bus_booking_history",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: true,
        },
      },
      booking_id: {
        type: DataTypes.INTEGER,
        validate:{
            notEmpty: true
        }
      },
      bus_route_search_id: {
        type: DataTypes.INTEGER,
        validate:{
            notEmpty: true
        }
      },
      status:{
        type:DataTypes.ENUM({
            values:["BOOKED","REFUND","CANCELED","CONFIRMED"]
        }),
      },
      amount_paid:{
        type:DataTypes.FLOAT,
        validate:{
            notEmpty: true
        }
      },
      amount_due:{
        type:DataTypes.FLOAT,
        validate:{
            notEmpty: true
        }
      },
      seats:{
        type:DataTypes.INTEGER,
        validate:{
            notEmpty: true
        },
        defaultValue:1
      },
      created_at :{
        type: 'TIMESTAMP' ,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at :{
        type: 'TIMESTAMP' ,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: "bus_booking_history",
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    }
  );
};

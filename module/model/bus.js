"use strict";

module.exports = function (sequelize, DataTypes) {
  const bus = sequelize.define(
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
    },
    {
      classMethods: {
        associate: function(models) {
        }
      }
    },
  );
  bus.associate = function(models){
    bus.hasOne(models.bus_route_search, {
      onDelete: "RESTRICT",
      foreignKey:  'bus_id',
      targetKey: 'id',
  });
  }
  return bus
};

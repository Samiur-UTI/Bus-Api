"use strict";

module.exports = function (sequelize, DataTypes) {
  const bus_route_search =  sequelize.define(
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
      price:{
        type: DataTypes.FLOAT,
        validate:{
            notEmpty: false
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
        defaultValue:"ON"
      }
    },
    {
      tableName: "bus_route_search",
      freezeTableName: true,
      timestamps: false,
      underscored: true,
    },
    {
      classMethods: {
        associate: function(models) {
        }
      }
    }
  );
  bus_route_search.associate = function(models){
    bus_route_search.belongsTo(models.bus,{
      onDelete: "RESTRICT",
      foreignKey:  'bus_id',
      targetKey: 'id',
    })
  }
  bus_route_search.associate = function(models){
    bus_route_search.belongsTo(models.route,{
      onDelete: "RESTRICT",
      foreignKey:  'route_id',
      targetKey: 'id',
    })
  }
  return bus_route_search
};

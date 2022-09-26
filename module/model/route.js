"use strict";

module.exports = function (sequelize, DataTypes) {
  const route= sequelize.define(
    "route",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
          notEmpty: true,
        },
      },
      from: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: true
        }
      },
      to: {
        type: DataTypes.STRING,
        validate:{
          notEmpty: true
      }
      },
      status:{
        type:DataTypes.ENUM({
            values: ['ACTIVE', 'INACTIVE']
          }),
        defaultValue:"ACTIVE"
      }
    },
    {
      tableName: "route",
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
  route.associate = function(models){
    route.hasOne(models.bus_route_search, {
      onDelete: "RESTRICT",
      foreignKey:  'route_id',
      targetKey: 'id',
  });
  }
  return route
};

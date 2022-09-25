"use strict";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED ,
        primaryKey: true ,
        autoIncrement: true
    },
    email : {
        type:DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password : {
        type:DataTypes.STRING,
        allowNull: false,
    },
    role:{
      type:DataTypes.ENUM({
        values:["CUSTOMER","ADMIN"]
      }),
    },
    customer_id:{
      type:DataTypes.INTEGER,
      allowNull: true,
    },
    admin_id:{
      type:DataTypes.INTEGER,
      allowNull: true,
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
    },
    isActive:{
      type:DataTypes.ENUM({
        values:["TRUE","FALSE"]
      })
    },
    socketID: {
        type:DataTypes.STRING(255),
        defaultValue:null,
        allowNull:true
    }
    }
  ,
  {
    timestamps: false,
    freezeTableName:true,
    tableName: 'user'
  }
  , {
    classMethods: {
      associate: function(models) {
      }
    }
  });
};
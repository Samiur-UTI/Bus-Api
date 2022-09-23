"use strict";
module.exports = function(sequelize, DataTypes) {
  const users = sequelize.define("users", {
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
    isActive: DataTypes.BOOLEAN,
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
    tableName: 'users'
  }
  , {
    classMethods: {
      associate: function(models) {
      }
    }
  });
    users.associate = function(models) {
        users.hasMany(models.messages, {
            onDelete: "CASCADE",
            foreignKey:'sender_id',
            targetKey: 'id',
            as: 'userMessages'
        });
    };
  return users;
};
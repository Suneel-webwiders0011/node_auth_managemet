'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Comment, {
        foreignKey: 'user_id',
        as: 'comments'
      });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetTokenExpiry: DataTypes.DATE,
    image:DataTypes.STRING,
    phone:DataTypes.NUMBER,
    file_path:DataTypes.STRING,
    user_type:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};

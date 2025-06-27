'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      Posts.hasMany(models.Comment, {
        foreignKey: 'post_id',
        as: 'comments'
      });
    }
  }
  Posts.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    status: DataTypes.INTEGER,
    published_date: DataTypes.DATE,

  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};
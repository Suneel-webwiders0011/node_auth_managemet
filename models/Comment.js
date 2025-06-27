'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Posts, {
        foreignKey: 'post_id',
        as: 'post'
      });

      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};

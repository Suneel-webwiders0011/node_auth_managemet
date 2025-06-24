// models/Comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id:DataTypes.INTEGER,
    post_id:DataTypes.INTEGER
  });

  return Comment;
};

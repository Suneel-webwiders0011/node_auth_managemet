const Comment = require('./Comment')(sequelize, DataTypes);
const Post = require('./posts')(sequelize, DataTypes);

db.Comments = Comment;
db.Posts = Post;

// Post has many Comments
db.Posts.hasMany(db.Comments, {
  foreignKey: 'post_id',
  as: 'comments'
});

// Comment belongs to a Post
db.Comments.belongsTo(db.Posts, {
  foreignKey: 'post_id',
  as: 'post'
});

// User has many Comments
db.Users.hasMany(db.Comments, {
  foreignKey: 'user_id',
  as: 'user_comments'
});

// Comment belongs to a User
db.Comments.belongsTo(db.Users, {
  foreignKey: 'user_id',
  as: 'user'
});

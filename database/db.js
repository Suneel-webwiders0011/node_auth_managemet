// require('dotenv').config();
// var mysql      = require('mysql');

// var connection = mysql.createConnection({

//     host     : process.env.DB_HOST,
//     user     : process.env.DB_USER,
//     password : process.env.DB_PASS,
//     database : process.env.DB_NAME,
//     port     : process.env.DB_PORT,

// });
 
// connection.connect(function(err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + connection.threadId);
// });

// module.exports = connection;


const Sequelize = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/user')(sequelize, Sequelize.DataTypes);
db.Posts = require('../models/posts')(sequelize, Sequelize.DataTypes);
db.Comment = require('../models/Comment')(sequelize, Sequelize.DataTypes);
db.Plans = require('../models/plan')(sequelize, Sequelize.DataTypes);
db.PlanPurchases = require('../models/planpurchase')(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

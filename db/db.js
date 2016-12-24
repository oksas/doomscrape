var Sequelize = require('sequelize');
var db = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost/doomscrape');

module.exports = db;

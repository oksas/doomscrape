var db = require('../db');
var Sequelize = require('sequelize');

var DoomImage = db.define('doom_image', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	author: {
		type: Sequelize.STRING
	},
	permalink: {
		type: Sequelize.STRING
	},
	postlink: {
		type: Sequelize.STRING
	},
	date: {
		type: Sequelize.DATE
	},
	filename: {
		type: Sequelize.STRING,
		unique: true
	},
	thumbname: {
		type: Sequelize.STRING
	}
});

DoomImage.sync();

module.exports = DoomImage;

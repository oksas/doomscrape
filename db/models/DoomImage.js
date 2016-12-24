var db = require('../db');
var Sequelize = require('sequelize');

var DoomImage = db.define('photo', {
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
	date: {
		type: Sequelize.DATE
	},
	filename: {
		type: Sequelize.STRING
	},
	thumbname: {
		type: Sequelize.STRING
	}
});

DoomImage.sync();

module.exprots = DoomImage;

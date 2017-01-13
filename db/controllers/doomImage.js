var DoomImage = require('../models/DoomImage');

var methods = {
	insertNew: imageData => {
		return DoomImage.findOrCreate({ where: imageData })
		.spread((doomImage, created) => {
			return doomImage.dataValues;
		});
	},
	findAll: filterOptions => {
		return DoomImage.findAll({ where: filterOptions });
	},
	remove: filterOptions => {
		return DoomImage.destroy({ where: filterOptions });
	}
};

module.exports = methods;

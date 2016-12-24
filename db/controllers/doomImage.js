var DoomImage = require('../models/DoomImage');

var methods = {
	insertNew: function(imageData) {
		return DoomImage.findOrCreate({ where: imageData })
		.spread((doomImage, created) => {
			return doomImage.dataValues;
		});
	},
	findAll: function(filterOptions) {
		return DoomImage.findAll({ where: filterOptions });
	}
};

module.exports = methods;

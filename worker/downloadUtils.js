var request = require('request-promise-native');
var fs = require('fs-promise');
var thenify = require('thenify');
var sizeOf = thenify(require('image-size'));
var imageConfig = require('./imageConfig');

let downloadUtils = {
	downloadImage(imageData) {
		let author = imageData.author.toLowerCase();
		let id = imageData.id;

		let options = {
			uri: imageData.imageSrc,
			resolveWithFullResponse: true,
			encoding: null
		};

		return request(options)
		.then(response => {
			if (response.headers['content-type'].substr(0, 5) !== 'image') {
				// handle this with a logger maybe?
			}

			let ext = imageConfig.extMappings[response.headers['content-type']];

			let imagePath = `${imageConfig.basePath}${author}_${id}.${ext}`;

			return fs.writeFile(imagePath, response.body)
				.then(() => {
					return imagePath;
				});
		});
	},

	getImageSize(imagePath) {
		return sizeOf(imagePath);
	}
};

module.exports = downloadUtils;

var request = require('request-promise-native');
var imageConfig = require('./imageConfig');
var fs = require('fs-promise');

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
	}
};

module.exports = downloadUtils;

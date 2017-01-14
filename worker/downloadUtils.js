var request = require('request-promise-native');
var fs = require('fs-promise');
var thenify = require('thenify');
var sizeOf = thenify(require('image-size'));
var thumb = thenify(require('node-thumbnail').thumb);
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

			let imagePath = imageConfig.basePath + this.getFilename(author, id, ext);

			return fs.writeFile(imagePath, response.body)
				.then(() => {
					return imagePath;
				});
		});
	},

	getImageSize(imagePath) {
		return sizeOf(imagePath);
	},

	createThumbnail(imageData) {
		return thumb({
			source: imageData.filepath + imageData.filename,
			destination: imageData.filepath,
			width: imageConfig.thumbSizes.w,
			suffix: imageConfig.thumbSuffix,
			quiet: true
		});
	},

	getFilename(author, id, ext) {
		return `${author}_${id}.${ext}`.toLowerCase();
	},

	getThumbname(author, id, ext) {
		return `${author}_${id}${imageConfig.thumbSuffix}.${ext}`.toLowerCase();
	}
};

module.exports = downloadUtils;

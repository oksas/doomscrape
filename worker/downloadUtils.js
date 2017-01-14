var request = require('request-promise-native');
var fs = require('fs-promise');
var thenify = require('thenify');
var sizeOf = thenify(require('image-size'));
var easyimage = require('easyimage');
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
		return easyimage.thumbnail({
			src: imageData.filepath + imageData.filename,
			dst: imageData.filepath + imageData.thumbname,
			width: imageConfig.thumbSizes.w,
			height: imageConfig.thumbSizes.h,
			x: 0,
			y: 0
		});
	},

	getFilename(author, id, ext) {
		return `${author}_${id}.${ext}`;
	},

	getThumbname(author, id, ext) {
		return `${author}_${id}_thumb.${ext}`;
	}
};

module.exports = downloadUtils;

var request = require('request-promise-native');
var fs = require('fs-promise');
var thenify = require('thenify');
var sizeOf = thenify(require('image-size'));
var thumb = thenify(require('node-thumbnail').thumb);
var imageConfig = require('./imageConfig');

let downloadUtils = {
	// imageData should be: { author, postlink, date, id, imageSrc }
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
			let fileLocationData = {
				filename: this.getFilename(author, id, ext),
				thumbname: this.getThumbname(author, id, ext),
				folderpath: imageConfig.basePath,
				filepath: imageConfig.basePath + this.getFilename(author, id, ext)
			};

			return fs.writeFile(fileLocationData.filepath, response.body)
				.then(() => {
					return fileLocationData;
				});
		});
	},

	getImageSize(filepath) {
		return sizeOf(filepath);
	},

	createThumbnail(imageData) {
		return thumb({
			source: imageData.filepath,
			destination: imageData.folderpath,
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

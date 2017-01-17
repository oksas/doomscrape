var request = require('request-promise-native');
var fs = require('fs-promise');
var thenify = require('thenify');
var sizeOf = thenify(require('image-size'));
var thumb = thenify(require('node-thumbnail').thumb);
var imageConfig = require('./imageConfig');

let downloadUtils = {
	// imageData should be: { author, postlink, date, id, imageSrc }
	downloadImage({ author, postlink, date, id, imageSrc }) {
		let options = {
			uri: imageSrc,
			resolveWithFullResponse: true,
			encoding: null
		};

		return request(options)
		.then(response => {
			if (response.headers['content-type'].substr(0, 5) !== 'image') {
				// handle this with a logger maybe?
			}

			let ext = imageConfig.extMappings[response.headers['content-type']];

			let normalizedAuthor = author.toLowerCase();
			let filename = this.getFilename(normalizedAuthor, id, ext);
			let thumbname = this.getThumbname(normalizedAuthor, id, ext);
			let folderpath = imageConfig.basePath;
			let filepath = folderpath + filename;

			return fs.writeFile(filepath, response.body)
				.then(() => {
					return {
						author: normalizedAuthor,
						postlink,
						date,
						filename,
						thumbname,
						folderpath,
						filepath
					};
				});
		});
	},

	downloadAllImages(imageList) {
		let allPendingDownloads = imageList.map(imageData => this.downloadImage(imageData));

		return Promise.all(allPendingDownloads);
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

	createAllThumbnails(imageList) {
		let allPendingThumbnails = imageList.map(imageData => this.createThumbnail(imageData));
		console.log('all pending:', allPendingThumbnails);

		return Promise.all(allPendingThumbnails);
	},

	getFilename(author, id, ext) {
		return `${author}_${id}.${ext}`.toLowerCase();
	},

	getThumbname(author, id, ext) {
		return `${author}_${id}${imageConfig.thumbSuffix}.${ext}`.toLowerCase();
	}
};

module.exports = downloadUtils;

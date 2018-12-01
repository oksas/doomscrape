var request = require('request-promise-native');
var fs = require('fs-promise');
var thenify = require('thenify');
var sizeOf = thenify(require('image-size'));
var thumb = require('node-thumbnail').thumb;
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
				console.log(`Image does not appear to be an image?`);
			}

			let ext = imageConfig.extMappings[response.headers['content-type']];

			let normalizedAuthor = author.toLowerCase();
			let filename = this.getFilename(normalizedAuthor, id, ext);
			let thumbname = this.getThumbname(normalizedAuthor, id, ext);
			let folderpath = imageConfig.basePath;
			let filepath = folderpath + filename;

			// this will fail if any directories it tries to write to do not exist
			// so there should be a check that all subdirectories exist
			// if not, make them
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
				})
				.then(() => {
					console.log(`Wrote image file ${filepath}`);
					console.log('\n');
				});
		})
		.catch(response => {
			console.log(`Failed to download image with src ${imageSrc}:`);
			console.log(`Status code: ${response.statusCode}`);
			console.log(`${response}`);
			console.log('\n');
			
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
			quiet: true,
			overwrite: true
		});
	},

	createAllThumbnails(imageList) {
		let allPendingThumbnails = imageList.map(imageData => this.createThumbnail(imageData));

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

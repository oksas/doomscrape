var fs = require('fs');
var request = require('request-promise-native');
var easyimage = require('easyimage');
var sizeOf = require('image-size');
var imageConfig = require('./imageConfig');

function downloadImage(imageData, callback) {
	let author = imageData.author.toLowerCase();
	let id = imageData.id;

	let options = {
		uri: imageData.image,
		resolveWithFullResponse: true,
		encoding: null
	};

	request(options)
	.then(function(response) {
		if (response.headers['content-type'].substr(0, 5) !== 'image') {
			return callback('Not an image');
		}

		let ext = imageConfig.extMappings[response.headers['content-type']];

		let imagePath = `${imageConfig.basePath}${author}_${id}.${ext}`;

		fs.writeFile(imagePath, response.body, fileWritten);

		function fileWritten(err) {
			if (err) return callback(err);
			console.log(`Saved ${author}_${id}`);
			sizeOf(imagePath, fileSized);
		}

		function fileSized(err, dimensions) {
			if (err ||
			dimensions.width < imageConfig.minSizes.w ||
			dimensions.height < imageConfig.minSizes.h) {
				fs.unlink(imagePath, fileDeleted);
				return console.log(`Image ${id} from ${author} is too small, probably`);
			}

			let fullData = {
				author: imageData.author,
				postlink: imageData.postlink,
				date: imageData.date,
				filename: `${author}_${id}.${ext}`,
				thumbname: `${author}_${id}_thumb.${ext}`,
				filepath: imageConfig.basePath
			};

			createThumbnail(fullData)
			.then(thumbnailCreated, thumbnailError);
		}

		function fileDeleted(err) {
			if (err) return callback(`There was an error deleting file ${imagePath}`);
			console.log(`Successfully deleted ${imagePath}`);
		}

		function createThumbnail(imageData) {
			return easyimage.thumbnail({
				src: imageData.filepath + imageData.filename,
				dst: imageData.filepath + imageData.thumbname,
				width: imageConfig.thumbSizes.w,
				height: imageConfig.thumbSizes.h,
				x: 0,
				y: 0
			});
		}

		function thumbnailCreated() {
			console.log(`Created thumbnail ${fullData.thumbname}`);
			callback(null, fullData);
		}

		function thumbnailError(err) {
			if (err) callback(`ERROR MAKING THUMBNAIL: \n${err}`);
		}
	})
	.catch(function(err) {
		if (err) {
			console.log('============');
			console.log(`THERE WAS AN ERROR WITH \n${imageData.image} from post \n${imageData.postlink}`);
			console.log('============');
		}
	});
}

module.exports = downloadImage;

var request = require('request-promise-native');
var jsdom = require('jsdom').jsdom;
var pageUtils = require('./pageUtils');

function getImages(url) {
	return request(url)
	.then(body => {
		console.log('page body is', body);
		let document = jsdom(body);

		let hasPosts = pageUtils.hasPosts(document);

		if (!hasPosts) {
			// handle with logger
		}

		let count = pageUtils.getPostCount(document);

		if (count < 30) {
			// handle with logger
		}

		// images can contain items that are either just image data objects, or
		// promises that resolve to image data objects fetched on Imgur or something
		let images = [];

		for (var i = 0; i < count; i++) {
			console.log('first post', document.querySelector('.cPost').innerHTML);
			let postData = pageUtils.getPostData(document, i);
			if (postData) {
				// use concat so that if a post has no images in it and returns [],
				// no invalid elems are added to the images array
				images = images.concat(postData);
			}
		}

		return Promise.all(images)
		.then(allImages => {
			let flattenedImages = [];
			allImages.forEach(image => {
				if (image !== null) {
					// if an image on imgur is too small it's ignored and marked as null,
					// so filter those out
					flattenedImages = flattenedImages.concat(image);
				}
			});

			return flattenedImages;
		});
	});
};

module.exports = getImages;

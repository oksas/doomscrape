var request = require('request-promise-native');
var jsdom = require('jsdom').jsdom;
var pageUtils = require('./pageUtils');

function getImages(url) {
	return request(url)
	.then(body => {
		let document = jsdom(body);

		let count = pageUtils.getPostCount(document);

		if (count === 0) {
			console.log(`The attempted url contains no posts: ${url}`);
			console.log(`Quitting`);
		} else if (count < 30) {
			console.log(`The attempted url contains more than 30 posts somehow?`);
			console.log(`Quitting`);
		}

		// images can contain items that are either just image data objects, or
		// promises that resolve to image data objects fetched on Imgur or something
		let images = [];

		console.log(`Iterating over ${count} posts...`);
		for (var i = 0; i < count; i++) {
			console.log('\n');
			let postData = pageUtils.getPostData(document, i);
			console.log(`Retrieved post data for post ${i}...`);
			if (postData) {
				console.log(`Found image data inside post ${i}; adding to queue`);
				// use concat so that if a post has no images in it and returns [],
				// no invalid elems are added to the images array
				images = images.concat(postData);
			}
		}

		console.log(`Flattening images...`);
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

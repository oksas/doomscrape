var request = require('request-promise-native');
var jsdom = require('jsdom').jsdom;
var pageUtils = require('./pageUtils');

function getImages(url) {
	return request(url)
	.then(body => {
		let document = jsdom(body);

		let hasPosts = pageUtils.hasPosts(document);

		if (!hasPosts) {
			// return callback(`No posts found on this page.`);
		}

		let count = pageUtils.getPostCount(document);

		if (count < 30) {
			// return callback(`page ${url}\n has less than 30 posts on it; ABORT`);
		}

		// images can contain items that are either just image data objects, or
		// promises that resolve to image data objects fetched on Imgur or something
		let images = [];

		// will need to use Promise.all here to account for getting imgur images,
		// which is another async operation
		for (var i = 0; i < count; i++) {
			let postData = pageUtils.getPostData(document, i);
			if (postData) {
				// use concat so that if a post has no images in it and returns [],
				// no invalid elems are added to the images array
				images = images.concat(postData);
			}
		}

		return Promise.all(images);
	});
};

module.exports = getImages;

var request = require('request-promise-native');
var jsdom = require('jsdom').jsdom;

function getImgurImages(url, postInfo) {
	return request(url, { resolveWithFullResponse: true })
	.then((response) => {
		let start = postInfo.startIndex;

		// an imgur link might be a link to a (possibly single image) gallery, or a
		// link to the img file itself; this covers the latter case
		if (response.headers['content-type'].substr(0, 5) === 'image') {
			let postData = {
				author: postInfo.author,
				postlink: postInfo.postlink,
				date: postInfo.date,
				imageSrc: url,
				id: `${postInfo.postId}_${start}`
			};

			return [postData];
		}

		let document = jsdom(response.body);
		let items = document.querySelectorAll('.zoom');

		if (!items.length) {
			// if there's an image but no .zoom elem, that means the image is too small
			// I tried to get around this by using the selector '.post-image img' instead
			// and changing src down below to use item.src instead of href, but for some
			// reason this led to jsdom finding two images on a page where there was only
			// one, even though doing the same query on the actual browser yeilded
			// the correct number
			// this is a really small edge case anyway, and we don't really care about
			// small images anyway, so I won't go out of my way to debug this oddity
			// just for images that will get discarded later in the pipeline anyway
			return null;
		}

		let images = [];

		[].forEach.call(items, function(item) {
			let src = 'http:' + item.href;

			let postData = {
				author: postInfo.author,
				postlink: postInfo.postlink,
				date: postInfo.date,
				imageSrc: src,
				id: `${postInfo.postId}_${start++}`
			};

			images.push(postData);
		});

		return images;
	});
};

module.exports = getImgurImages;

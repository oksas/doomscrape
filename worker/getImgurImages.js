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
				image: url,
				id: `${postInfo.postId}_${start}`
			};

			return [postData];
		}

		let document = jsdom(response.body);
		let items = document.querySelectorAll('.zoom');
		let images = [];

		[].forEach.call(items, function(item) {
			let src = 'http:' + item.href;

			let postData = {
				author: postInfo.author,
				postlink: postInfo.postlink,
				date: postInfo.date,
				image: src,
				id: `${postInfo.postId}_${start++}`
			};

			images.push(postData);
		});

		return images;
	});
};

module.exports = getImgurImages;

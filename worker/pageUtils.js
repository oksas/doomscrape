var getImgurImages = require('./getImgurImages');

let pageUtils = {
	hasPosts(document) {
		return document.querySelectorAll('.cPost').length;
	},

	getPostCount(document) {
		return document.querySelectorAll('.cPost').length;
	},

	// note to self: I don't think this function returns anything but the actual list
	// of images from a post? meaning that the author name, post id, etc. don't seem
	// to be stored anywhere? or at least not from what I can see at first glance at this
	// code after several years. could be wrong though. - 11/30/2018
	getPostData(document, i) {
		// rewritten to new DW
		let post = document.querySelectorAll(`.cPost`)[i];

		// rewritten to new DW
		let postAuthor = post.querySelector(`.cAuthorPane_author a > span`).innerHTML;

		// rewritten to new DW
		// there are two potential <time> elements inside a post:
		// the first is the date in "Posted ____ (edited)" at the top
		// the second is "Edited ____ by Author" at the bottom if edited
		let postDate = post.querySelectorAll(`time`)[0].dateTime;
		postDate = new Date(postDate);

		// rewritten to new DW
		// the permalink doesn't seem to have any unique class, so we have to fetch
		// it relative to the time element
		let postPermalink = post.querySelectorAll(`time`)[0].parentElement.href;
		
		// rewritten to new DW
		let postId = post.querySelector('.ipsComment_content').getAttribute('commentid');

		// rewritten to new DW
		let postContent = post.querySelector(`.cPost_contentWrap > div > p`);

		let imageCount = 0;

		let allPostData = {
			author: postAuthor,
			postlink: postPermalink,
			date: postDate
		};

		console.log(`allPostData for post ${i}:`);
		console.log(allPostData);

		// images could be static image data, or a Promise returned from
		// getImgurImages etc.
		let images = [];

		[].forEach.call(postContent.childNodes, function(node) {
			let postData;
			let src;

			if (node.nodeName === 'IMG') {
				src = node.src;
				postData = Object.assign({}, allPostData, {
					imageSrc: src,
					id: `${postId}_${++imageCount}`
				});

				images.push(postData);
			} else if (node.nodeName === 'A' &&
									node.firstElementChild &&
									node.firstElementChild.nodeName === 'IMG' &&
									node.firstElementChild.src.includes('imgur.com')) {
				// image is a thumbnail, wrapped in an <a>, whose href is likely to the
				// full version on imgur
				postData = Object.assign({}, allPostData, {
					postId: postId,
					startIndex: ++imageCount
				});

				images.push(getImgurImages(node.href, postData));
			} else if (node.nodeName === 'A' &&
									node.firstElementChild &&
									node.firstElementChild.nodeName === 'IMG') {
				src = node.firstElementChild.src;
				postData = Object.assign({}, allPostData, {
					imageSrc: src,
					id: `${postId}_${++imageCount}`
				});

				images.push(postData);
			} else if (node.nodeName === 'A' &&
									node.host.includes('imgur.com')) {
				// image is not actually an image; just a link to an image on imgur
				// (Tango seems most often guilty of this, what a guy)
				postData = Object.assign({}, allPostData, {
					postId: postId,
					startIndex: ++imageCount
				});

				images.push(getImgurImages(node.href, postData));
			}
		});

		return images;
	}
};

module.exports = pageUtils;

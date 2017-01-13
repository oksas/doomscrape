var getImgurImages = require('./getImgurImages');

let pageUtils = {
	// postBase tells us how many tables inside body we need to skip before finding
	// a potential post
	postBase: 5,

	hasPosts(document) {
		return document.querySelector('body > table:nth-of-type(5)')
			.nextElementSibling.nextSibling.nextSibling.nodeValue !== ' /spacer ';
	},

	getPostCount(document) {
		let count = 1;
		let currentPost = document.querySelector(`body > table:nth-of-type(${this.postBase + count})`);

		while (currentPost.nextSibling.nextSibling.nodeValue !== ' spacer ') {
			count++;
			currentPost = document.querySelector(`body > table:nth-of-type(${this.postBase + count})`);
		}

		return count;
	},

	getPostData(document, i) {
		let post = document.querySelector(`body > table:nth-of-type(${this.postBase + i + 1})`);

		let postAuthor = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(1) font b`).innerHTML;

		let postDate = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[1].nodeValue;
		postDate = new Date(postDate);

		let postPermalink = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[4].href;

		let postId = /post\/(\d+)/g.exec(postPermalink)[1];

		let postContent = post.querySelector(`tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(2) font:nth-of-type(2)`);

		let imageCount = 0;

		let allPostData = {
			author: postAuthor,
			postlink: postPermalink,
			date: postDate
		};

		// images could be static image data, or a Promise returned from
		// getImgurImages etc.
		let images = [];

		[].forEach.call(postContent.childNodes, function(node) {
			let postData,
				src;

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

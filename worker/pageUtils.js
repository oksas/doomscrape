let pageUtils = {
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
	}
};

module.exports = pageUtils;

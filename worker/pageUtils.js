const pageUtils = {
	hasPosts(document) {
		return document.querySelector('body > table:nth-of-type(5)')
			.nextElementSibling.nextSibling.nextSibling.nodeValue !== ' /spacer ';
	},

	getPostCount(document) {

	}
};

module.exports = pageUtils;

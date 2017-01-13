/* eslint-env node, mocha */
/* eslint-disable no-unused-vars */
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var jsdom = require('jsdom').jsdom;
var request = require('request-promise-native');
var pageUtils = require('../../worker/pageUtils');
/* eslint-enable no-unused-vars */

// 30 posts
let fullPageUrl = 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/400';

// 0 posts
let emptyPageUrl = 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/522';

// 1 - 29 posts, inclusive
let partialPageUrl = 'https://www.doomworld.com/vb/doom-general/91781-is-there-a-clean-textless-version-of-the-heretic-tome-of-power-art/';

describe('pageUtils', function() {
	describe('hasPosts', () => {
		it('should return true if a page has at least 1 post', done => {
			request(partialPageUrl)
			.then(body => {
				let document = jsdom(body);
				let hasPosts = pageUtils.hasPosts(document);
				expect(hasPosts).to.equal(true);
			})
			.then(() => {
				done();
			});
		});

		it('should return true if a page has 30 posts', done => {
			request(fullPageUrl)
			.then(body => {
				let document = jsdom(body);
				let hasPosts = pageUtils.hasPosts(document);
				expect(hasPosts).to.equal(true);
			})
			.then(() => {
				done();
			});
		});

		it('should return false if a page has no posts', done => {
			request(emptyPageUrl)
			.then(body => {
				let document = jsdom(body);
				let hasPosts = pageUtils.hasPosts(document);
				expect(hasPosts).to.equal(false);
			})
			.then(() => {
				done();
			});
		});
	});

	// we are not bothering to test empty pages for now since that's really hasPosts' job
	describe('getPostCount', () => {
		it('should accurately report a post count on a full page', done => {
			request(fullPageUrl)
			.then(body => {
				let document = jsdom(body);
				let postCount = pageUtils.getPostCount(document);
				expect(postCount).to.equal(30);
			})
			.then(() => {
				done();
			});
		});

		it('should accurately report a post count on a partial page', done => {
			request(partialPageUrl)
			.then(body => {
				let document = jsdom(body);
				let postCount = pageUtils.getPostCount(document);
				expect(postCount).to.equal(1);
			})
			.then(() => {
				done();
			});
		});
	});

	// check that getImgurImages is called when page has imgur pics on it?
});

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

// post 25 (from index 0) by Z0k has two images in the same post
let multiImagePostUrl = 'https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/141/';

describe('pageUtils', function() {
	this.timeout(4000);

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

	describe('getPostData', () => {
		it('should assign unique ids to multiple photos contained in a single post', done => {
			request(multiImagePostUrl)
			.then(body => {
				let document = jsdom(body);
				// use of Promise.all isn't really necessary here since these two
				// particular images shouldn't need to be fetched form imgur or anything
				// because they're just <img>s and not inside an <a>, but let's use
				// Promise.all for consistency anyway
				return Promise.all(pageUtils.getPostData(document, 25));
			})
			.then(allPostImages => {
				expect(allPostImages.length).to.equal(2);
				expect(allPostImages[0].author).to.equal(allPostImages[1].author);
				expect(allPostImages[0].id).to.not.equal(allPostImages[1].id);
			})
			.then(() => {
				done();
			});
		});
	});
});

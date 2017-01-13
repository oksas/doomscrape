/* eslint-env node, mocha */
/* eslint-disable no-unused-vars */
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var getImages = require('../../worker/getImages');
/* eslint-enable no-unused-vars */

let url = 'https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/141/';

// has screenshots as <a> elems, hosted on Imgur
let pageWithImgurUrl = 'https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/153/';

describe('getImages', function() {
	this.timeout(4000);

	it('should find the proper number of images on a full page', done => {
		getImages(url)
		.then(images => {
			expect(images.length).to.equal(12);
		})
		.then(() => {
			done();
		});
	});

	it('should find the proper number of images on a full page with imgur images', done => {
		getImages(pageWithImgurUrl)
		.then(images => {
			// there are 15 images on the page, but gaspe's image is really small and
			// so getImgurImages ignores it, so we'll pretend it doesn't exist
			expect(images.length).to.equal(14);
		})
		.then(() => {
			done();
		});
	});
});

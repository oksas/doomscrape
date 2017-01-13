/* eslint-env node, mocha */
/* eslint-disable no-unused-vars */
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var getImages = require('../../worker/getImages');
/* eslint-enable no-unused-vars */

let url = 'https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/141/';

describe('getImages', () => {
	it('should find the proper number of images on a full page', done => {
		getImages(url)
		.then(images => {
			expect(images.length).to.equal(12);
			done();
		});
	});
});

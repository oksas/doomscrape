/* eslint-env node, mocha */
/* eslint-disable no-unused-vars */
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-promise');
var downloadUtils = require('../../worker/downloadUtils');
/* eslint-enable no-unused-vars */

describe('downloadUtils', function() {
	describe('downloadImage', () => {
		it('should be able to download an image', done => {
			let imageData = {
				author: 'Tango',
				postlink: 'https://www.doomworld.com/vb/post/1549540',
				date: '2016-01-25T08:00:00.000Z',
				imageSrc: 'http://i.imgur.com/dm1elVV.png',
				id: '1549540_1'
			};

			let filepath;

			downloadUtils.downloadImage(imageData)
			.then(path => {
				filepath = path;
				return fs.exists(filepath);
			})
			.then(exists => {
				expect(exists).to.equal(true);
			})
			.then(() => {
				return fs.unlink(filepath);
			})
			.then(() => {
				done();
			});
		});
	});
});

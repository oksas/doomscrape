/* eslint-env node, mocha */
/* eslint-disable no-unused-vars */
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-promise');
var downloadUtils = require('../../worker/downloadUtils');
/* eslint-enable no-unused-vars */

describe('downloadUtils', function() {
	let sampleImage = {
		author: 'Tango',
		postlink: 'https://www.doomworld.com/vb/post/1549540',
		date: '2016-01-25T08:00:00.000Z',
		imageSrc: 'http://i.imgur.com/dm1elVV.png',
		id: '1549540_1'
	};

	describe('downloadImage', () => {
		it('should be able to download an image', done => {
			let filepath;

			downloadUtils.downloadImage(sampleImage)
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

	describe('getImageSize', () => {
		it('should be able to report the size of an image', done => {
			let filepath;

			downloadUtils.downloadImage(sampleImage)
			.then(path => {
				filepath = path;
				return downloadUtils.getImageSize(filepath);
			})
			.then(dimensions => {
				expect(dimensions.width).to.equal(1920);
				expect(dimensions.height).to.equal(1080);
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

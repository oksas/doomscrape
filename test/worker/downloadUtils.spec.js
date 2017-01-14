/* eslint-env node, mocha */
/* eslint-disable no-unused-vars */
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs-promise');
var downloadUtils = require('../../worker/downloadUtils');
var imageConfig = require('../../worker/imageConfig');
/* eslint-enable no-unused-vars */

describe('downloadUtils', function() {
	this.timeout(4000);

	let sampleImage = {
		author: 'Tango',
		postlink: 'https://www.doomworld.com/vb/post/1549540',
		date: '2016-01-25T08:00:00.000Z',
		imageSrc: 'http://i.imgur.com/dm1elVV.png',
		id: '1549540_1'
	};
	let sampleExt = 'png';

	describe('downloadImage', () => {
		it('should be able to download an image', done => {
			let savedpath;

			downloadUtils.downloadImage(sampleImage)
			.then(path => {
				savedpath = path;
				return fs.exists(savedpath);
			})
			.then(exists => {
				expect(exists).to.equal(true);
			})
			.then(() => {
				return fs.unlink(savedpath);
			})
			.then(() => {
				done();
			});
		});
	});

	describe('getImageSize', () => {
		it('should be able to report the size of an image', done => {
			let savedpath;

			downloadUtils.downloadImage(sampleImage)
			.then(path => {
				savedpath = path;
				return downloadUtils.getImageSize(savedpath);
			})
			.then(dimensions => {
				expect(dimensions.width).to.equal(1920);
				expect(dimensions.height).to.equal(1080);
			})
			.then(() => {
				return fs.unlink(savedpath);
			})
			.then(() => {
				done();
			});
		});
	});

	describe('createThumbnail', () => {
		it('should be able to create a thumbnail for a given file', done => {
			let savedpath;
			let imageToResizeData = {
				filename: downloadUtils.getFilename(sampleImage.author, sampleImage.id, sampleExt),
				thumbname: downloadUtils.getThumbname(sampleImage.author, sampleImage.id, sampleExt),
				filepath: imageConfig.basePath
			};

			downloadUtils.downloadImage(sampleImage)
			.then(path => {
				savedpath = path;
				return downloadUtils.createThumbnail(imageToResizeData);
			})
			.then(() => {
				return fs.exists(imageToResizeData.filepath + imageToResizeData.thumbname);
			})
			.then(exists => {
				expect(exists).to.equal(true);
			})
			.then(() => {
				return fs.unlink(savedpath);
			})
			.then(() => {
				return fs.unlink(imageToResizeData.filepath + imageToResizeData.thumbname);
			})
			.then(() => {
				done();
			});
		});
	});
});

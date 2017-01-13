/* eslint-env node, mocha */
/* eslint-disable no-unused-vars */
let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let doomImage = require('../../../db/controllers/doomImage');
/* eslint-enable no-unused-vars */

let testImage = {
	author: 'TestUser',
	permalink: 'http://localhost/sup.png',
	postlink: 'http://localhost/#300',
	date: Date.now(),
	filename: 'Tango01.png',
	thumbname: 'Tango01_thumb.png'
};

let authorFilter = { author: testImage.author };

describe('doomImage controller', () => {
	afterEach(done => {
		doomImage.remove({ author: testImage.author })
		.then(() => {
			done();
		});
	});

	it('should be able to save a doom_image and retrieve it', done => {
		doomImage.insertNew(testImage)
		.then(newImage => {
			return doomImage.findAll(authorFilter);
		})
		.then(allFoundImages => {
			expect(allFoundImages.length).to.equal(1);

			let foundImage = allFoundImages[0].dataValues;
			let testKeys = Object.keys(testImage);

			for (let key of testKeys) {
				if (key !== 'date') {
					// don't bother testing date equality, it gets a little messy
					expect(foundImage[key]).to.equal(testImage[key]);
				}
			}
		})
		.then(() => {
			done();
		});
	});
});

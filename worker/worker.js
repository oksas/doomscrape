var getImages = require('./getImages');
var downloadUtils = require('./downloadUtils');

var urls = [
  // 'https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/141/',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/400',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/401',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/402',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/403',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/404',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/420',
	// 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/421',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/422',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/426',
  // 'https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/427/',
	'https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/131/'
];

getImages(urls[0])
.then(images => {
	return downloadUtils.downloadAllImages(images);
})
// .then(downloadedImages => {
// 	return downloadUtils.createAllThumbnails(downloadedImages);
// })
.then(() => {
	console.log('All done downloading and creating thumbnails from images');
	return;
});

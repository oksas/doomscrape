var getImages = require("./getImages");
var dlImage = require("./downloadImage");

var urls = [
  // "https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/42/",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/100",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/101",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/102",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/103",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/104",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/500",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/501",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/502",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/405"
];

urls.forEach(url => {
  getImages(url, function(err, data) {
    if (err) {
      return console.error(err);
    }

    data.forEach(item => {
      dlImage(item);
    });
  });
});

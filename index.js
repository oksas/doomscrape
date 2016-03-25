var getImages = require("./getImages");
var dlImage = require("./downloadImage");

var urls = [
  "https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/42/"
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

var getImages = require("./getImages");
var dlImage = require("./downloadImage");
var db = require("./db");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/dwscraper");

var urls = [
  // "https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/141/",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/400",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/401",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/402",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/403",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/404",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/420",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/421",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/422",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/426",
  // "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/427/",
  // "https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/131/"
];

urls.forEach(url => {
  getImages(url, function(err, data) {
    if (err) {
      return console.error(err);
    }

    data.forEach(item => {
      dlImage(item, function(err, imageData) {
        if (err) {
          return console.error(err);
        }

        db.createNew(imageData, function(err, img) {
          if (err) {
            return console.error(err);
          }

          console.log("Image saved to database!");
        });
      });
    });
  });
});

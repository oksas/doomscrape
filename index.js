var getImages = require("./getImages");
var dlImage = require("./downloadImage");
var db = require("./db");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/dwscraper");

var urls = [
  "https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/142/",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/200",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/201",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/202",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/203",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/204",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/320",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/321",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/322",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/326",
  "https://www.doomworld.com/vb/doom-general/42866-post-your-doom-picture-post-in-part-2-instead/521/",
  "https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/130/"
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
        })
      });
    });
  });
});

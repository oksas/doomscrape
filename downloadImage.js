var fs = require("fs");
var request = require("request");
var easyimage = require("easyimage");

function downloadImage(imageData) {
  var ext = "";
  var extMappings = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif"
  }

  request(imageData.image, function(err, response, body) {
    ext = extMappings[response.headers["content-type"]];
  })
    .pipe(fs.createWriteStream(`public/images/${imageData.author}_${imageData.id}.temp`))
    .on("finish", function() {
      console.log(ext);
      fs.rename(`public/images/${imageData.author}_${imageData.id}.temp`, `public/images/${imageData.author}_${imageData.id}.${ext}`, function(err) {
        if (err) throw err;
        easyimage.thumbnail({
          src: `public/images/${imageData.author}_${imageData.id}.${ext}`,
          dst: `public/images/${imageData.author}_${imageData.id}_thumb.${ext}`,
          width: 128, height: 128,
          x: 0, y: 0
        });
      });
    });
};

module.exports = downloadImage;

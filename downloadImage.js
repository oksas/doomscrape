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

  var thumbSizes = {
    w: 176,
    h: 100
  }

  var rootPath = "public/images/";
  var author = imageData.author.toLowerCase();
  var id = imageData.id;

  request(imageData.image, function(err, response, body) {
    ext = extMappings[response.headers["content-type"]] || "png";
  })
    .pipe(fs.createWriteStream(`${rootPath}${author}_${id}.temp`))
    .on("finish", function() {
      fs.rename(`${rootPath}${author}_${imageData.id}.temp`, `public/images/${author}_${id}.${ext}`, function(err) {
        if (err) throw err;

        easyimage.thumbnail({
          src: `${rootPath}${author}_${id}.${ext}`,
          dst: `${rootPath}${author}_${id}_thumb.${ext}`,
          width: thumbSizes.w, height: thumbSizes.h,
          x: 0, y: 0
        });
      });
    });
};

module.exports = downloadImage;

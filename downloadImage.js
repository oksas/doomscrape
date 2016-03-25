var fs = require("fs");
var request = require("request");
var easyimage = require("easyimage");
var sizeOf = require("image-size");

function downloadImage(imageData, path) {
  var ext = "";
  var extMappings = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif"
  };

  var thumbSizes = {
    w: 176,
    h: 100
  };

  var minSizes = {
    w: 200,
    h: 200
  };

  var rootPath = path || "public/images/";
  var author = imageData.author.toLowerCase();
  var id = imageData.id;

  request(imageData.image, function(err, response, body) {
    ext = extMappings[response.headers["content-type"]] || "png";
  })
    .pipe(fs.createWriteStream(`${rootPath}${author}_${id}.temp`))
    .on("finish", function() {
      fs.rename(`${rootPath}${author}_${imageData.id}.temp`, `public/images/${author}_${id}.${ext}`, function(err) {
        if (err) throw err;

        var imagePath = `public/images/${author}_${id}.${ext}`;
        var imageThumbPath = `${rootPath}${author}_${id}_thumb.${ext}`

        sizeOf(imagePath, function(err, dimensions) {
          if (dimensions.width < minSizes.w || dimensions.height < minSizes.h) {
            fs.unlink(imagePath, function(err) {
              if (err) console.error(`There was an error deleting file ${imagePath}`);

              console.log(`Successfully deleted ${imagePath}`);
            })
            return console.log(`Image ${id} from ${author} is too small`)
          }

          easyimage.thumbnail({
            src: imagePath,
            dst: imageThumbPath,
            width: thumbSizes.w, height: thumbSizes.h,
            x: 0, y: 0
          });
        });
      });
    });
};

module.exports = downloadImage;

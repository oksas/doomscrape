var fs = require("fs");
var rp = require("request-promise");
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

  var options = {
    uri: imageData.image,
    resolveWithFullResponse: true,
    encoding: null
  };

  rp(options)
    .then(function(response) {
      console.log(response.headers["content-type"]);

      var ext = extMappings[response.headers["content-type"]] || "png";

      var imagePath = `${rootPath}${author}_${id}.${ext}`;
      var imageThumbPath = `${rootPath}${author}_${id}_thumb.${ext}`;

      fs.writeFile(imagePath, response.body, function(err) {
        if (err) throw err;

        console.log("Saved the file with no errors I guess?");

        sizeOf(imagePath, function(err, dimensions) {
          if (err) throw err;

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
    })
    .catch(function(err) {
      if (err) {
        console.log("============");
        console.log(`THERE WAS AN ERROR:\n ${err}`);
        console.log("============");
      }
    });
};

module.exports = downloadImage;

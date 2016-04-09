var fs = require("fs");
var rp = require("request-promise");
var easyimage = require("easyimage");
var sizeOf = require("image-size");
var imageConfig = require("./imageConfig");

function downloadImage(imageData, callback) {
  var ext = "";

  var author = imageData.author.toLowerCase();
  var id = imageData.id;

  var options = {
    uri: imageData.image,
    resolveWithFullResponse: true,
    encoding: null
  };

  rp(options)
    .then(function(response) {

      var ext = imageConfig.extMappings[response.headers["content-type"]] || "png";

      var imagePath = `${imageConfig.basePath}${author}_${id}.${ext}`;

      fs.writeFile(imagePath, response.body, fileWritten);

      function fileWritten(err) {
        if (err) return callback(err);
        console.log(`Saved ${author}_${id}`);
        sizeOf(imagePath, response.body, fileSized);
      }

      function fileSized(err, dimensions) {

        if (err ||
            dimensions.width < imageConfig.minSizes.w ||
            dimensions.height < imageConfig.minSizes.h) {
          fs.unlink(imagePath, fileDeleted);
          return console.log(`Image ${id} from ${author} is too small, probably`);
        }

        var fullData = {
          author: imageData.author,
          _id: imageData.id,
          permalink: imageData.permalink,
          date: imageData.date,
          filename: `${author}_${id}.${ext}`,
          thumbname: `${author}_${id}_thumb.${ext}`,
          filepath: imageConfig.basePath,
          meta: {
            reportCount: 0
          }
        };

        createThumbnail(fullData)
          .then(thumbnailCreated, thumbnailError);

      }

      function fileDeleted(err) {
        if (err) return callback(`There was an error deleting file ${imagePath}`);
        console.log(`Successfully deleted ${imagePath}`);
      }

      function createThumbnail(imageData) {
        return easyimage.thumbnail({
          src: imageData.filepath + imageData.filename,
          dst: imageData.filepath + imageData.thumbname,
          width: imageConfig.thumbSizes.w,
          height: imageConfig.thumbSizes.h,
          x: 0, y: 0
        });
      }

      function thumbnailCreated() {
        console.log(`Created thumbnail ${fullData.thumbname}`);
        callback(null, fullData);
      }

      function thumbnailError(err) {
        if (err) callback(`ERROR MAKING THUMBNAIL: \n${err}`);
      }

    })
    .catch(function(err) {
      if (err) {
        console.log("============");
        console.log(`THERE WAS AN ERROR WITH \n${imageData.image} from post \n${imageData.permalink}`);
        console.log("============");
      }
    });
}

module.exports = downloadImage;

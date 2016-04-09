var fs = require("fs");
var rp = require("request-promise");
var easyimage = require("easyimage");
var sizeOf = require("image-size");
var createThumbnail = require("./createThumbnail");
var imageConfig = require("./imageConfig");
// Split this all up into separate functions
// Make sure each part gets the right data; createThumbnail is expecting imageData
// that also has filename and thumbname, so make sure it gets that data
// Probably make a copy of the args using Object.assign, and put new things on it
// (filename and thumbname), then give it to the functions that need it, such as
// createThumbnail
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
      var imageThumbPath = `${imageConfig.basePath}${author}_${id}_thumb.${ext}`;

      fs.writeFile(imagePath, response.body, function(err) {
        if (err) return callback(err);

        console.log(`Saved ${author}_${id}`);

        sizeOf(imagePath, function(err, dimensions) {

          if (err ||
              dimensions.width < imageConfig.minSizes.w ||
              dimensions.height < imageConfig.minSizes.h) {
            fs.unlink(imagePath, function(err) {
              if (err) return callback(`There was an error deleting file ${imagePath}`);

              console.log(`Successfully deleted ${imagePath}`);
            });
            return console.log(`Image ${id} from ${author} is too small, probably`);
          }
          // imageData needs to have the filename and thumbname
          // so do imageData.filename = whatever
          // I guess? That seems like poor practice though
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
            .then(function(image) {
              console.log(`Created thumbnail ${imageThumbPath}`);
              callback(null, fullData);

            },
            function(err) {
              if (err) callback(`ERROR MAKING THUMBNAIL: \n${err}`);
            });
        });

      });
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

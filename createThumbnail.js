var easyimage = require("easyimage");
var imageConfig = require("./imageConfig");

// Returns a promise; so you can .then it
function createThumbnail(imageData) {
  return easyimage.thumbnail({
    src: imageData.filepath + imageData.filename,
    dst: imageData.filepath + imageData.thumbname,
    width: imageConfig.thumbSizes.w,
    height: imageConfig.thumbSizes.h,
    x: 0, y: 0
  });
}

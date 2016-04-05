var mongoose = require("mongoose");
var random = require("mongoose-simple-random");

var doomImageSchema = mongoose.Schema({
  // author
  author: String,
  // permalink
  permalink: String,
  // date
  date: Date,
  // filename
  filename: String,
  // filepath
  filepath: String,
  // id (the post id + the index of img within said post)
  _id: String,
  // metadata; tbd
  meta: {
    reportCount: Number
  }
});

doomImageSchema.statics.findByAuthor = function(author, callback) {
  return this.find({ author: new RegExp(author, "i") }, callback);
};

doomImageSchema.statics.findByDate = function(date, callback) {
  return this.find({ date: date }, callback);
};

doomImageSchema.plugin(random);

var DoomImage = mongoose.model("DoomImage", doomImageSchema);
// later, use DoomImage.findByAuthor or findByDate

module.exports = DoomImage;


/*
  NEEDS TO HAVE METHODS TO:

  - save a new entry to the db

  - update an entry's metadata (such as liked, reported'ds, etc)

  - find by author

  - find by date

  - get random entry

  - get newest x?

  - get most recent x?
*/

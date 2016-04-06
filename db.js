var mongoose = require("mongoose");
var random = require("mongoose-simple-random");
var mongoosePaginate = require("mongoose-paginate");

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
doomImageSchema.plugin(mongoosePaginate);

var DoomImage = mongoose.model("DoomImage", doomImageSchema);
// later, use DoomImage.findByAuthor or findByDate

function newDoomImage(imageData, callback) {
  DoomImage.create(imageData, callback);
}

module.exports = {

  createNew: function(imageData, callback) {
    DoomImage.create(imageData, callback);
  },

  findByAuthor: function(author, callback) {
    DoomImage.findByAuthor(author, callback);
  },

  findByDate: function(date, callback) {
    DoomImage.findByDate(date, callback);
  },

  getPage: function(callback) {
    DoomImage.paginate({ }, { page: 2, limit: 5 }, callback);
  }
};


/*
  NEEDS TO HAVE METHODS TO:

  - save a new entry to the db(entry, callback)

  - update an entry's metadata (such as liked, reported'ds, etc) (id, data, callback)

  - find by author (author)

  - find by date (date)

  - get random entry(limit?)

  - get newest x?

  - get most recent x?
*/

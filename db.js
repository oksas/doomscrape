var mongoose = require("mongoose");
var random = require("mongoose-simple-random");

var doomImageSchema = mongoose.Schema({
  // author
  // permalink
  // date
  // filename
  // filepath
  // id
});

doomImageSchema.plugin(random);

var DoomImage = mongoose.model("DoomImage", doomImageSchema);



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

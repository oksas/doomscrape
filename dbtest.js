var DoomImage = require("./db");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/dwscraper");

DoomImage.findByAuthor("dragonfly", function(err, docs) {
  if (err) throw err;
  console.log(docs);
});

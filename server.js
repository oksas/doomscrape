var express = require("express");
var app = express();
var db = require("./db");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/dwscraper");

var port = process.env.PORT || 1024;

app.get("/", function(req, res) {
  res.send("This is the index haha.");
});

app.get("/images/", function(req, res) {
  db.getImages(req.query, function(err, docs) {
    res.send(docs);
  });
});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});

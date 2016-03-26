var request = require("request");

request("http://imagizer.imageshack.us/scaled/640x480/59/1nrc.png", function(err, response, body) {
  if (err) throw err;

  console.log("No error?");

  console.log(response.statusCode);
});

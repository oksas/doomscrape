var request = require("request");
var jsdom = require("jsdom").jsdom;

module.exports = function getImgurImages(url, postInfo, callback) {
  request(url, function(err, response, body) {
    if (err) {
      return callback(err);
    }

    var start = postInfo.startIndex;

    if (response.headers["content-type"].substr(0, 5) === "image") {
      var postData = {
        author: postInfo.author,
        permalink: postInfo.permalink,
        date: postInfo.date,
        image: url,
        id: `${postInfo.postId}_${start}`
      };

      return callback(null, [postData]);
    }

    var document = jsdom(body),
        items = document.querySelectorAll(".zoom"),
        count = items.length,
        images = [];

    items.forEach(function(item) {
      var src = "http:" + item.href;

      var postData = {
        author: postInfo.author,
        permalink: postInfo.permalink,
        date: postInfo.date,
        image: src,
        id: `${postInfo.postId}_${start++}`
      };

      images.push(postData);
    });

    callback(null, images);
  });
};

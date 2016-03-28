var request = require("request");
var jsdom = require("jsdom").jsdom;

module.exports = function getImgurImages(url, postInfo, callback) {
  // postData contains author, permalink, date, postId
  request(url, function(err, response, body) {
    if (err) throw err;

    var start = postInfo.startIndex;

    if (response.headers["content-type"].substr(0, 5) === "image") {
      console.log(`The image at\n ${url} is just an image`);
      var postData = {
        author: postInfo.author,
        permalink: postInfo.permalink,
        date: postInfo.date,
        image: url,
        id: `${postInfo.postId}_${start}`
      };

      return callback(null, [postData]);
    }

    var document = jsdom(body);

    var items = document.querySelectorAll(".zoom");
    var count = items.length;
    var images = [];

    console.log(`Found ${count} images on page ${url} from post ${postInfo.postId}`);

    for (var i = 0; i < items.length; i++) {
      var src = "http:" + items[i].href;

      console.log(`Getting source ${src} from imgur post`);

      var postData = {
        author: postInfo.author,
        permalink: postInfo.permalink,
        date: postInfo.date,
        image: src,
        id: `${postInfo.postId}_${start++}`
      };
      images.push(postData);
      console.log(`ADDING IMGUR LINK:\n${postData}`);
    }

    callback(null, images);
  });
};

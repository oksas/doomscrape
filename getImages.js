var request = require("request");
var jsdom = require("jsdom").jsdom;

function getImages(url, callback) {
  request(url, function(err, response, body) {
    if (err) throw err;

    var document = jsdom(body);

    var hasPosts = document.querySelector("body > table:nth-of-type(5)").nextElementSibling.nextSibling.nextSibling.nodeValue === " /spacer " ? false : true;

    if (!hasPosts) {
      return callback(`No posts found on this page.`);
    }

    var postBase = 5;
    var count = 1;
    var currentPost = document.querySelector(`body > table:nth-of-type(${postBase + count})`);

    while (currentPost.nextSibling.nextSibling.nodeValue !== " spacer ") {
      count++;
      currentPost = document.querySelector(`body > table:nth-of-type(${postBase + count})`);
    }

    console.log(`This page has ${count} posts`);

    var images = [];

    // count is now the num of posts on the page
    for (var i = 0; i < count; i++) {
      var post = document.querySelector(`body > table:nth-of-type(${postBase + i + 1})`);

      var postAuthor = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(1) font b`).innerHTML;

      // need post date
      var postDate = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[1].nodeValue;

      // need post permalink
      var postPermalink = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[4].href;

      var postId = /post\/(\d+)/g.exec(postPermalink)[1];
      console.log("THE POST ID IS" + postId);

      var postContent = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(2) font:nth-of-type(2)`);

      for (var j = 0; j < postContent.childNodes.length; j++) {

        if (postContent.childNodes[j].nodeName === "IMG") {
          var src = postContent.childNodes[j].src;
          var postData = {
            author: postAuthor,
            permalink: postPermalink,
            date: postDate,
            image: src,
            id: `${postId}_${j}`
          }
          images.push(postData);
        } else if (postContent.childNodes[j].nodeName === "A" && postContent.childNodes[j].host === "imgur.com") {
          // call the imgur function! and pass it a postData obj or w/e
        }
      }
    }
    console.log("IMAGES INCOMING");
    // images.forEach(image => console.log(image));
    callback(null, images);
  });
}

module.exports = getImages;
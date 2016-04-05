var request = require("request");
var jsdom = require("jsdom").jsdom;
var getImgurImages = require("./getImgurImages");

module.exports = function getImages(url, callback) {
  request(url, function(err, response, body) {
    if (err) throw err;

    var document = jsdom(body);

    var hasPosts = document.querySelector("body > table:nth-of-type(5)")
      .nextElementSibling.nextSibling.nextSibling.nodeValue === " /spacer " ?
      false : true;

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

    if (count < 30) {
      return callback(`page ${url}\n has less than 30 posts on it; ABORT`);
    }

    var images = [];

    // count is now the num of posts on the page
    for (var i = 0; i < count; i++) {
      var post = document.querySelector(`body > table:nth-of-type(${postBase + i + 1})`);

      var postAuthor = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(1) font b`).innerHTML;

      var postDate = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[1].nodeValue;
      postDate = new Date(postDate);

      var postPermalink = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[4].href;

      var postId = /post\/(\d+)/g.exec(postPermalink)[1];

      var postContent = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(2) font:nth-of-type(2)`);

      var imageCount = 0;

      var allPostData = {
        author: postAuthor,
        permalink: postPermalink,
        date: postDate
      };

      for (var j = 0; j < postContent.childNodes.length; j++) {

        var node = postContent.childNodes[j];
        if (node.nodeName === "IMG") {

          var src = node.src;
          var postData = {
            author: postAuthor,
            permalink: postPermalink,
            date: postDate,
            image: src,
            id: `${postId}_${++imageCount}`
          };
          // var postData = Object.create({}, allPostData, {
          //   image: src,
          //   id: `${postId}_${++imageCount}`
          // });

          // this doesn't work even with --harmony; is object spread not a thing anymore?
          // var postData = {
          //   ...allPostData,
          //   image: src,
          //   id: `${postId}_${++imageCount}`
          // };
          images.push(postData);

        } else if (node.nodeName === "A" &&
                    node.firstElementChild &&
                    node.firstElementChild.nodeName === "IMG" &&
                    node.firstElementChild.src.includes("imgur.com")) {
          // HEY YOU, FUTURE ME
          // consolidate all this silly postData creation in the future using Object.create or spread or something
          var postData = {
            author: postAuthor,
            permalink: postPermalink,
            date: postDate,
            postId: postId,
            startIndex: ++imageCount
          };
          getImgurImages(node.href, postData, callback);

        } else if (node.nodeName === "A" &&
                    node.firstElementChild &&
                    node.firstElementChild.nodeName === "IMG") {

          var src = node.firstElementChild.src;
          var postData = {
            author: postAuthor,
            permalink: postPermalink,
            date: postDate,
            image: src,
            id: `${postId}_${++imageCount}`
          };
          images.push(postData);

        } else if (node.nodeName === "A" &&
                    node.host.includes("imgur.com")) {
          console.log(`Found an imgur link in post by ${postAuthor}`);
          var postData = {
            author: postAuthor,
            permalink: postPermalink,
            date: postDate,
            postId: postId,
            startIndex: ++imageCount
          };
          getImgurImages(node.href, postData, callback);
        }

      }
    }
    callback(null, images);
  });
};

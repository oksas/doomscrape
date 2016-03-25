var request = require("request");
var jsdom = require("jsdom").jsdom;

var url = "https://www.doomworld.com/vb/doom-general/70830-post-your-doom-picture-part-2-read-the-image-posting-rules-in-the-faq/4/";

request(url, function(err, response, body) {
  if (err) {
    return console.log("There was an error :[");
  }

  var document = jsdom(body);

  var hasPosts = document.querySelector("body > table:nth-of-type(5)").nextElementSibling.nextSibling.nextSibling.nodeValue === " /spacer " ? false : true;

  console.log(`Does this page have posts? ${hasPosts}`);

  var nS = "nextSibling";
  var postBase = 5;
  var count = 1;
  var currentPost = document.querySelector(`body > table:nth-of-type(${postBase + count})`);

  while (currentPost[nS][nS].nodeValue !== " spacer ") {
    count++;
    currentPost = document.querySelector(`body > table:nth-of-type(${postBase + count})`);
  }

  console.log(`This page has ${count} posts`);

  var images = [];

  // count is now the num of posts on the page
  for (var i = 0; i < count; i++) {
    var post = document.querySelector(`body > table:nth-of-type(${postBase + i + 1})`);
    console.log(post);

    var postAuthor = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(1) font b`).innerHTML;
    console.log(postAuthor);

    // need post date
    var postDate = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[1].nodeValue;
    // ^ that is the element that contains an img, followed by text node of the date, then time in a font, then a with link to post
    // so get postDate's childNode[1]'s nodeValue
    console.log(postDate);

    // need post permalink
    var postPermalink = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[4].href;
    console.log(postPermalink);

    var postContent = document.querySelector(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(2) font:nth-of-type(2)`);
    // to get image in post, do that ^ and just append img? I guess. what about multiple images?
    console.log(`Post content is: ${postContent}`);

    for (var j = 0; j < postContent.childNodes.length; j++) {

      if (postContent.childNodes[j].nodeName === "IMG") {
        var src = postContent.childNodes[j].src;
        var postData = {
          author: postAuthor,
          permalink: postPermalink,
          date: postDate,
          image: src
        }
        images.push(postData);
      } else if (postContent.childNodes[j].nodeName === "A" && postContent.childNodes[j].host === "imgur.com") {

      }
    }
  }
  console.log("IMAGES INCOMING");
  images.forEach(image => console.log(image));
});

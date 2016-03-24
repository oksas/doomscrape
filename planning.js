// check for posts
var hasPosts = $("body > table:nth-of-type(5)").nextElementSibling.nextSibling.nextSibling.nodeValue === " /spacer " ? false : true;

// exit if no posts
if (!hasPosts) {
  return callback(`No posts found on this page.`);
}

// count posts
var nS = "nextSibling";
var postBase = 5;
var count = 1;
var currentPost = $(`body > table:nth-of-type(${postBase + count})`);

while (currentPost[nS][nS].nodeValue !== " spacer ") {
  count++;
  currentPost = $(`body > table:nth-of-type(${postBase + count})`);
}

console.log(count);
var images = [];

// count is now the num of posts on the page
for (var i = 0; i < count; i++) {
  var post = $(`body > table:nth-of-type(${postBase + i + 1})`);
  console.log(post);

  var postAuthor = $(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(1) font b`).innerText;
  console.log(postAuthor);

  // need post date
  var postDate = $(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[1].nodeValue;
  // ^ that is the element that contains an img, followed by text node of the date, then time in a font, then a with link to post
  // so get postDate's childNode[1]'s nodeValue
  console.log(postDate);

  // need post permalink
  var postPermalink = $(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(2) td:nth-of-type(1) font`).childNodes[4].href;
  console.log(postPermalink);

  var postContent = $(`body > table:nth-of-type(${postBase + i + 1}) tr td:nth-of-type(2) table tbody tr td table tbody tr:nth-of-type(1) td:nth-of-type(2) font:nth-of-type(2)`);
  // to get image in post, do that ^ and just append img? I guess. what about multiple images?
  console.log(postContent);

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

    }
    // else if <a> from imgur, try to extract the data? but shouldn't that be the job of something else?
    // yes; should make separate module for extracting that info; an imgur scraper?
  }

  // need to walk the post content to find images
  // for postContent's child nodes
    // if this child node's nodeName is "IMG", get its src attribute (elem.src, just like elem.nodeName)
    // OR nodeNAme is "A" and the href is an imgur link
    // push the object to the array!

  // ONLY PUSH TO FINAL ARRAY OF STUFF FOR EACH IMAGE IN POST IMAGE
}
console.log("IMAGES INCOMING");
console.log(images);

// stuff to do inside each post

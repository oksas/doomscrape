// check for posts
var hasPosts = $("body > table:nth-of-type(5)").nextElementSibling.nextSibling.nextSibling.nodeValue === " /spacer " ? false : true;
// 7 times???
// exit if no posts
if (!hasPosts) {
  return callback(`No posts found on this page.`);
}

// count posts
var count = 1;
var firstPost = $("body > table:nth-of-type(6)");
var nS = "nextSibling";

console.log(firstPost.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeValue === " spacer ")

console.log(firstPost[nS][nS][nS][nS][nS][nS][nS][nS][nS].nodeValue === " spacer ")

var nS = "nextSibling";
var postBase = 5;
var count = 1;
// var currentPost = $("body > table:nth-of-type(" + (postBase + count) + ")");
var currentPost = $(`body > table:nth-of-type(${postBase + count})`);

while (currentPost[nS][nS].nodeValue !== " spacer ") {
  count++;
  currentPost = $(`body > table:nth-of-type(${postBase + count})`);
}

console.log(count);

// count is now the num of posts on t he page


// stuff to do inside each post

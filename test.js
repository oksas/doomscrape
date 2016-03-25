var request = require("request");
var jsdom = require("jsdom").jsdom;

var url = "https://www.doomworld.com/vb/doom-editing/86835-good-midi-site/";

request(url, function(err, response, body) {
  if (err) {
    return console.log("There was an error :[");
  }

  var document = jsdom(body);

  console.log(document.querySelector("body > table:nth-of-type(5)"));

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
});

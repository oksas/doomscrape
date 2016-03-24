/*
THREE CASES FOR IMGUR:
1 - link to album; this means format is imgur.com/a/whatever
2 - link to single image; format is imgur.com/whatever
3 - link to image directly

Case 3 should be handled in the scraper maybe? Actually no, that should be handled here in the imgur module.

Single image post structure:
<div class="post-images">
  <div id="<postId>" class="post-image-container">
    <div class="post-image">
      <a href="<the image url>">
        <img src="<the image url>" />
      </a>
    </div>
  </div>
</div>

If album, simply look for each img inside the .post-image elem (which is inside a .post-image-container).

if (link is to image directly) {
  return the image url;
} else if (link is to single image) {
  return the src of the image within post images
} else if (link is to album) {
  shit how do I handle this
}

$(".post-image img").not(".post-image-placeholder")

Actually, can apparently just do ^ and get em all in a jQuery object; one and done. Loop over them, return as array


THIS MODULE should always return an array. Then whatever calls it can always expect it to be an array, and loop over it accordingly (basically always in case of an album). If the data is an array, then the module that calls it can, for each item in the array, add an item, just like it's already doing for the <img> elements inside each post
*/

# Doomworld Forums Image Scraper

## Notes to self about where to continue later

The download/create thumbnail pipeline is basically complete. Download utils has some `all` methods that use `Promise.all` to download a batch of images, or create thumbnails for a batch of images. This formerly did not work, but not seems to when incorporating the support for Promises that I added to the `node-thumbnail` package. The package author has not yet put released a new version on npm that utilizes this code, so all I did for now was copy the contents of `thumbnail.js` from the GitHub repo into the appropriate place in the `node_modules` folder in this repo. This is pretty non-optimal but will have to do until a new version is released. (Also, note to self, you should still submit a PR to that repo that adds some stuff in the docs about support for native Promises)

Next steps are to set up uploading, and storage. Then set up process for updating some marker in DB about what pages have been checked already, etc.

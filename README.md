# Doomworld Forums Image Scraper

## Notes to self about where to continue later

Some more notes on data flow and assembling complete records to be put in the db. `pageUtils.getPostData` gets a few properties: `author`, `postlink`, `date`, `id`, and the url of the image src in non-Imgur cases (`image` current, but could probably be renamed). Thus the remaining fields to be completed before saving to the database, and what's required for them:

- `permalink`: this field refers to a link to *my* version of the image on the internet, ie its location on S3 once file upload is set up
- `filename`: this will make use of the `id` field being constructed by `pageUtils.getPostData`; file extension will be included here, so the `filename` field can be completed after downloading the image and determining its file type
- `thumbname`: this depends on `filename`, so whenever filename is assembled, `thumbname` can be assembled based on whatever naming scheme I choose (I'm thinking maybe just a `_thumb` suffix or something)

I think that covers it. Good next steps is definitely fleshing out more tests for `pageUtils` and `getImages` as necessary, and ensuring a flat structure in everything that uses `Promise.all` to accumulate image data. Then, set up downloading of images, set up S3, set up saving of images to DB once uploaded. Then add field in database to track last page updated. Then set up the worker to do its thing and check for new posts/pages every so often. Then figure out where to host the DB and the worker.

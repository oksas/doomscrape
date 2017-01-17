# Doomworld Forums Image Scraper

## Notes to self about where to continue later

The download/create thumbnail pipeline is basically complete. Download utils has some `all` methods that use `Promise.all` to download a batch of images, or create thumbnails for a batch of images (but the `all` thumbnail creation doesn't seem to be working properly; the Promise is never rejecting nor resolving). Next steps are to fix the thumbnail not working, then set up uploading, and storage. Then set up process for updating some marker in DB about what pages have been checked already, etc.

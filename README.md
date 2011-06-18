Mock Swiper
=============

A utility for displaying mocks creating for a tablet device. Images are called via json on each initial swipe to increase speed and load times.

Currently the views are only linear and do not include any section-based options. I intend to include this option in the future. Also, current implementation is iPad only.

Getting Started
-------
* Dimensions for images should be 1004x768 & 748x1024 (subtract 20px from orientation for Carrier bar)
* Add image names & paths to images.json (example names & paths provided in file)
* Landscape images will need "-horiz" appendix; portrait image name (article.png) & landscape image name (article-horiz.png)
* Visit "mock-swiper" url on iPad.
* Tap "Share" icon in menu bar
* Tap "Add to Home Screen"
* Tap icon after being added to your "Home Screen". 
* Viewer should load in Safari with no url bar. Voila

Future Releases & Goals
-------
* Add loading icon for slow load calls
* Add Section Based views to handle larger scope projects
* Move to structure to be device-agnostic
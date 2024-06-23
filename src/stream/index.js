const getFbVideoInfo = require("fb-downloader-scrapper");

// Get the Facebook URL from the command-line arguments
const fbUrl = process.argv[2];

if (!fbUrl) {
    console.log("Please provide a Facebook video URL.");
    process.exit(1);
}

getFbVideoInfo(fbUrl)
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });

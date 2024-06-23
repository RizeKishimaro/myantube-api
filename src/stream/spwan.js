
const exec = require('child_process').exec;

const fbLink = process.argv[2];
const child = exec(`node index.js ${fbLink}`,
    (error, stdout, stderr) => {
        console.log( stdout);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
});

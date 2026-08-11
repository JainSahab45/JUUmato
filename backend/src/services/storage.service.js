const ImageKit = require("imagekit");
require('dotenv').config();

const {
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT
} = process.env;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    throw new Error(
        "Missing ImageKit env variables"
    );
}

const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT
});

async function uploadfile(file , fileName) {
    const result = await imagekit.upload({
        file : file,
        fileName : fileName
    })
    return result
}

module.exports = { 
    uploadfile
}
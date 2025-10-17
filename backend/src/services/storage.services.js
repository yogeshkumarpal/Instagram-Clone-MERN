const imageKit = require("imagekit");

const storageInstance = new imageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const sendFiles = async (file, fileName) => {
  try {
    let res = await storageInstance.upload({
      file,
      fileName,
      folder: "instagram-clone",
    });

    return res;
  } catch (error) {
    console.log("error while uploading images on imagekit");
  }
};

module.exports = sendFiles;

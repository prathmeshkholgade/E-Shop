const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.ApiKey,
  api_secret: process.env.ApiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "eshop",
    allowerdFormats: ["png", "jpg", "jpeg"], // supports promises as ,
  },
});

module.exports = { cloudinary, storage };







const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure accepted image file-types
const MIME_TYPE_MAP = [
  'image/png',
  'image/jpeg',
  'image/jpg'
];

module.exports = { cloudinary, MIME_TYPE_MAP };

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Only configure if credentials are provided
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

// Simple memory storage for now (can be upgraded to Cloudinary later)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };

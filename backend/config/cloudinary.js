// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;

// Function to connect to Cloudinary
const cloudinaryConnect = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });
    console.log('Cloudinary connection established');
};

// Export the connect function
module.exports = { cloudinaryConnect };

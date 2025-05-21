const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (filePath, folder, height, quality) => {
  try {
    // Set options for the upload
    const options = { folder, resource_type: "auto" };
    if (height) options.height = height;
    if (quality) options.quality = quality;

    console.log('Uploading file to Cloudinary:', filePath, 'with options:', options);

    // Perform the upload
    const result = await cloudinary.uploader.upload(filePath, options);
    console.log('Cloudinary upload successful:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message, error.response);
    throw new Error('Failed to upload image to Cloudinary.');
  }
};

const cloudinary = require('../../config/cloudinary');

const uploadToCloudinary = (buffer, folder = 'rsk') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          const errMessage = error && error.message ? error.message : JSON.stringify(error);
          return reject(new Error(errMessage));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.on('error', (err) => {
      const errMessage = err && err.message ? err.message : JSON.stringify(err);
      reject(new Error(errMessage));
    });

    stream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    const errMessage = error && error.message ? error.message : JSON.stringify(error);
    console.error('Error deleting image from Cloudinary:', errMessage);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};

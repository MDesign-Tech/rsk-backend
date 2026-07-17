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

const handleImageUpdate = async (doc, file, folder) => {
  if (!file) {
    return null;
  }

  const previousPublicId = doc.imagePublicId || null;

  // Upload first. If this fails we throw before touching the document or the old image.
  const result = await uploadToCloudinary(file.buffer, folder);

  try {
    // Remove the previous image only after a successful upload.
    if (previousPublicId) {
      await deleteFromCloudinary(previousPublicId);
    }

    doc.image = result.secure_url;
    doc.imagePublicId = result.public_id;

    return result;
  } catch (error) {
    // DB save (or old-image delete) failed after a successful upload:
    // attempt to delete the newly uploaded image to avoid orphans.
    await deleteFromCloudinary(result.public_id);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  handleImageUpdate,
};

const HeroContent = require('../models/HeroContent');
const { upload } = require('../middleware/upload');
const { uploadToCloudinary, deleteFromCloudinary } = require('../src/utils/cloudinaryUpload');

const getHero = async (req, res) => {
  const hero = await HeroContent.findOne();

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: 'Hero content not found',
      errors: ['No hero content available'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Hero content retrieved successfully',
    data: { hero },
  });
};

const updateHero = async (req, res) => {
  let hero = await HeroContent.findOne();

  if (!hero) {
    hero = await HeroContent.create(req.body);
  } else {
    Object.assign(hero, req.body);
    await hero.save();
  }

  return res.status(200).json({
    success: true,
    message: 'Hero content updated successfully',
    data: { hero },
  });
};

const uploadHeroImage = async (req, res) => {
  let hero = await HeroContent.findOne();

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: 'Hero content not found',
      errors: ['Please create hero content first'],
    });
  }

  try {
    if (hero.bgImagePublicId) {
      await deleteFromCloudinary(hero.bgImagePublicId);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'rsk/hero');

    hero.bgImage = result.secure_url;
    hero.bgImagePublicId = result.public_id;
    await hero.save();

    return res.status(200).json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: { hero },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      errors: [error.message],
    });
  }
};

module.exports = {
  getHero,
  updateHero,
  uploadHeroImage,
};

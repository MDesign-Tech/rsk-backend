const HeroContent = require('../models/HeroContent');
const { upload } = require('../middleware/upload');
const { handleImageUpdate } = require('../src/utils/cloudinaryUpload');

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

// PUT /hero
// Accepts multipart/form-data. Updates text fields and, when an image file is
// present, uploads it to Cloudinary (replacing the previous image) in the same
// atomic request. If no image is sent, only the text fields are updated.
const updateHero = async (req, res) => {
  try {
    let hero = await HeroContent.findOne();

    if (!hero) {
      hero = new HeroContent();
    }

    // Apply text fields from the request body.
    Object.assign(hero, req.body);

    // Handle image upload (no-op if no file was provided).
    await handleImageUpdate(hero, req.file, 'rsk/hero');

    await hero.save();

    return res.status(200).json({
      success: true,
      message: 'Hero content updated successfully',
      data: { hero },
    });
  } catch (error) {
    console.error('Hero update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update hero content',
      errors: [error.message || 'Unknown error'],
    });
  }
};

module.exports = {
  getHero,
  updateHero,
  upload, // exported for route-level multer wiring
};

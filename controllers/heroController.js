const HeroContent = require('../models/HeroContent');
const { upload, deleteFile } = require('../middleware/upload');

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

  if (hero.bgImage) {
    deleteFile(hero.bgImage);
  }

  hero.bgImage = `/uploads/${req.file.filename}`;
  await hero.save();

  return res.status(200).json({
    success: true,
    message: 'Hero image uploaded successfully',
    data: { hero },
  });
};

const toggleSubtitleVisibility = async (req, res) => {
  let hero = await HeroContent.findOne();

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: 'Hero content not found',
      errors: ['No hero content available'],
    });
  }

  hero.subtitleVisible = req.body.visible;
  await hero.save();

  return res.status(200).json({
    success: true,
    message: 'Subtitle visibility updated successfully',
    data: { hero },
  });
};

const toggleTrustVisibility = async (req, res) => {
  let hero = await HeroContent.findOne();

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: 'Hero content not found',
      errors: ['No hero content available'],
    });
  }

  hero.trustVisible = req.body.visible;
  await hero.save();

  return res.status(200).json({
    success: true,
    message: 'Trust visibility updated successfully',
    data: { hero },
  });
};

module.exports = {
  getHero,
  updateHero,
  uploadHeroImage,
  toggleSubtitleVisibility,
  toggleTrustVisibility,
};

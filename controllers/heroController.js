const HeroContent = require("../models/HeroContent");

const getHero = async (req, res) => {
  const hero = await HeroContent.findOne();

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: "Hero content not found",
      errors: ["No hero content available"],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Hero content retrieved successfully",
    data: { hero },
  });
};

// PUT /hero
// Updates text fields and images array when provided in the request body.
const updateHero = async (req, res) => {
  try {
    let hero = await HeroContent.findOne();

    if (!hero) {
      hero = new HeroContent();
    }

    // Update text fields
    if (req.body.title !== undefined) hero.title = req.body.title;
    if (req.body.services !== undefined) hero.services = req.body.services;

    // Handle images array - ensure only one image is active
    if (req.body.images && Array.isArray(req.body.images)) {
      // Check if any image is marked as active in the request
      const hasActiveImage = req.body.images.some((img) => img.isActive === true);
      
      // If no image is marked as active, set the first one as active
      hero.images = req.body.images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        isActive: hasActiveImage ? img.isActive === true : index === 0,
      }));
    }

    await hero.save();

    return res.status(200).json({
      success: true,
      message: "Hero content updated successfully",
      data: { hero },
    });
  } catch (error) {
    console.error("Hero update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update hero content",
      errors: [error.message || "Unknown error"],
    });
  }
};

module.exports = {
  getHero,
  updateHero,
};

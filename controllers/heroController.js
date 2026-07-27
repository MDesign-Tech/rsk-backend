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
// Updates text fields and image URL when provided in the request body.
const updateHero = async (req, res) => {
  try {
    let hero = await HeroContent.findOne();

    if (!hero) {
      hero = new HeroContent();
    }

    // Apply text fields from the request body.
    Object.assign(hero, req.body);

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

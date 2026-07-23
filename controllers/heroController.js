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

// PATCH /hero/visibility/subtitle
// Updates only the subtitle visibility flag.
const updateSubtitleVisibility = async (req, res) => {
  try {
    const { subtitleVisible } = req.body;

    let hero = await HeroContent.findOne();

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero content not found",
        errors: ["No hero content available"],
      });
    }

    hero.subtitleVisible = subtitleVisible;
    await hero.save();

    return res.status(200).json({
      success: true,
      message: "Subtitle visibility updated successfully",
      data: { hero },
    });
  } catch (error) {
    console.error("Subtitle visibility update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update subtitle visibility",
      errors: [error.message || "Unknown error"],
    });
  }
};

// PATCH /hero/visibility/trust
// Updates only the trust visibility flag.
const updateTrustVisibility = async (req, res) => {
  try {
    const { trustVisible } = req.body;

    let hero = await HeroContent.findOne();

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero content not found",
        errors: ["No hero content available"],
      });
    }

    hero.trustVisible = trustVisible;
    await hero.save();

    return res.status(200).json({
      success: true,
      message: "Trust visibility updated successfully",
      data: { hero },
    });
  } catch (error) {
    console.error("Trust visibility update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update trust visibility",
      errors: [error.message || "Unknown error"],
    });
  }
};

module.exports = {
  getHero,
  updateHero,
  updateSubtitleVisibility,
  updateTrustVisibility,
};

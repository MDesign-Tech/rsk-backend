const AboutUs = require("../models/AboutUs");

const getAbout = async (req, res) => {
  const about = await AboutUs.findOne();

  if (!about) {
    return res.status(404).json({
      success: false,
      message: "About data not found",
      errors: ["No about data available"],
    });
  }

  res.status(200).json({
    success: true,
    message: "About retrieved successfully",
    data: {
      about,
    },
  });
};

const updateAbout = async (req, res) => {
  let about = await AboutUs.findOne();

  if (!about) {
    about = await AboutUs.create(req.body);
  } else {
    if (req.body.socialMedia) {
      about.socialMedia = {
        ...about.socialMedia,
        ...req.body.socialMedia,
      };
      delete req.body.socialMedia;
    }

    Object.assign(about, req.body);

    await about.save();
  }

  res.status(200).json({
    success: true,
    message: "About updated successfully",
    data: {
      about,
    },
  });
};

const toggleSocialMediaVisibility = async (req, res) => {
  let about = await AboutUs.findOne();

  if (!about) {
    return res.status(404).json({
      success: false,
      message: "About data not found",
      errors: ["No about data available"],
    });
  }

  const platform = req.params.platform;
  const validPlatforms = ['facebook', 'instagram', 'whatsapp', 'x', 'linkedin', 'youtube', 'tiktok', 'snapchat'];

  if (!validPlatforms.includes(platform)) {
    return res.status(400).json({
      success: false,
      message: "Invalid social media platform",
      errors: [`Platform must be one of: ${validPlatforms.join(', ')}`],
    });
  }

  if (!about.socialMedia[platform]) {
    about.socialMedia[platform] = { href: null, visible: true };
  }

  about.socialMedia[platform].visible = req.body.visible;
  await about.save();

  res.status(200).json({
    success: true,
    message: "Social media visibility updated successfully",
    data: {
      about,
    },
  });
};

const toggleAboutVisibility = async (req, res) => {
  let about = await AboutUs.findOne();

  if (!about) {
    return res.status(404).json({
      success: false,
      message: "About data not found",
      errors: ["No about data available"],
    });
  }

  about.visible = req.body.visible;
  await about.save();

  res.status(200).json({
    success: true,
    message: "About visibility updated successfully",
    data: {
      about,
    },
  });
};

const toggleStatVisibility = async (req, res) => {
  let about = await AboutUs.findOne();

  if (!about) {
    return res.status(404).json({
      success: false,
      message: "About data not found",
      errors: ["No about data available"],
    });
  }

  const statIndex = parseInt(req.params.index, 10);

  if (statIndex < 0 || statIndex >= about.stats.length) {
    return res.status(404).json({
      success: false,
      message: "Stat not found",
      errors: ["No stat found at this index"],
    });
  }

  about.stats[statIndex].visible = req.body.visible;
  await about.save();

  res.status(200).json({
    success: true,
    message: "Stat visibility updated successfully",
    data: {
      about,
    },
  });
};

const toggleContactMethodVisibility = async (req, res) => {
  let about = await AboutUs.findOne();

  if (!about) {
    return res.status(404).json({
      success: false,
      message: "About data not found",
      errors: ["No about data available"],
    });
  }

  const contactIndex = parseInt(req.params.index, 10);

  if (contactIndex < 0 || contactIndex >= about.contactMethods.length) {
    return res.status(404).json({
      success: false,
      message: "Contact method not found",
      errors: ["No contact method found at this index"],
    });
  }

  about.contactMethods[contactIndex].visible = req.body.visible;
  await about.save();

  res.status(200).json({
    success: true,
    message: "Contact method visibility updated successfully",
    data: {
      about,
    },
  });
};

module.exports = {
  getAbout,
  updateAbout,
  toggleAboutVisibility,
  toggleStatVisibility,
  toggleContactMethodVisibility,
  toggleSocialMediaVisibility,
};

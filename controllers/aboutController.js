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

module.exports = {
  getAbout,
  updateAbout,
};

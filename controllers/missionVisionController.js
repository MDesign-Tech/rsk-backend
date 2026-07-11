const MissionVision = require("../models/MissionVision");

const getMissionVision = async (req, res) => {
  const missionVision = await MissionVision.findOne();

  if (!missionVision) {
    return res.status(404).json({
      success: false,
      message: "Mission and Vision not found",
      errors: ["No mission and vision data available"],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Mission and Vision retrieved successfully",
    data: missionVision,
  });
};

const updateMissionVision = async (req, res) => {
  let missionVision = await MissionVision.findOne();

  if (!missionVision) {
    missionVision = await MissionVision.create(req.body);
  } else {
    missionVision.missionTitle = req.body.missionTitle;
    missionVision.missionDescription = req.body.missionDescription;
    missionVision.visionTitle = req.body.visionTitle;
    missionVision.visionDescription = req.body.visionDescription;

    await missionVision.save();
  }

  return res.status(200).json({
    success: true,
    message: "Mission and Vision updated successfully",
    data: missionVision,
  });
};

module.exports = {
  getMissionVision,
  updateMissionVision,
};

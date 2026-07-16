const mongoose = require("mongoose");

const missionVisionSchema = new mongoose.Schema(
  {
    missionTitle: {
      type: String,
      required: [true, "Mission title is required"],
      trim: true,
    },

    missionDescription: {
      type: String,
      required: [true, "Mission description is required"],
      trim: true,
    },

    visionTitle: {
      type: String,
      required: [true, "Vision title is required"],
      trim: true,
    },

    visionDescription: {
      type: String,
      required: [true, "Vision description is required"],
      trim: true,
    },

    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MissionVision", missionVisionSchema);
const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true,
    },
    text: {
      type: String,
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

module.exports = mongoose.model('Partner', partnerSchema);
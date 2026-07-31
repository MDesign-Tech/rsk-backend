const mongoose = require('mongoose');

const heroImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const heroContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    services: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
    ],
    images: [heroImageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HeroContent', heroContentSchema);

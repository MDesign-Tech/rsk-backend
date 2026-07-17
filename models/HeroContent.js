const mongoose = require('mongoose');

const heroContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Subtitle is required'],
      trim: true,
    },
    trust: {
      type: String,
      trim: true,
    },
    subtitleVisible: {
      type: Boolean,
      default: true,
    },
    trustVisible: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HeroContent', heroContentSchema);

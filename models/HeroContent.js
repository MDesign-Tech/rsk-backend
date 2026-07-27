const mongoose = require('mongoose');

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

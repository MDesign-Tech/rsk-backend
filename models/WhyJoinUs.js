const mongoose = require('mongoose');

const whyJoinUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Why Join RSK',
      trim: true,
    },
    description: {
      type: String,
      default:
        'Join a premium corporate community designed for growth. Move faster with trusted partners, business support, and member-only opportunities for teams and leaders.',
      trim: true,
    },
    points: [
      {
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        visible: {
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
    ],
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WhyJoinUs', whyJoinUsSchema);

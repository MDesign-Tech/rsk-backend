const mongoose = require('mongoose');

const whyBecomeMemberSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Become a member.',
      trim: true,
    },
    description: {
      type: String,
      default: 'Member benefits designed for modern businesses.',
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

module.exports = mongoose.model('WhyBecomeMember', whyBecomeMemberSchema);

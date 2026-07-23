const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamSection',
    },
    socialMedia: {
      facebook: {
        href: {
          type: String,
          default: null,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      instagram: {
        href: {
          type: String,
          default: null,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      whatsapp: {
        href: {
          type: String,
          default: null,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      x: {
        href: {
          type: String,
          default: null,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      linkedin: {
        href: {
          type: String,
          default: null,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      youtube: {
        href: {
          type: String,
          default: null,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);

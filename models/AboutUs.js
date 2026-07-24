const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    stats: [
      {
        number: {
          type: String,
          required: true,
          trim: true,
        },
        label: {
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

    contactMethods: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: String,
          required: true,
          trim: true,
        },

        href: {
          type: String,
          default: null,
        },

        visible: {
          type: Boolean,
          default: true,
        },
      },
    ],

    ourStory: {
          title: {
            type: String,
            required: [true, "Our story title is required"],
            trim: true,
          },
          description: {
            type: String,
            required: [true, "Our story description is required"],
          },
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
      tiktok: {
        href: {
          type: String,
          default: null,
        },
        visible: {
          type: Boolean,
          default: true,
        },
      },
      snapchat: {
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
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AboutUs", aboutUsSchema);

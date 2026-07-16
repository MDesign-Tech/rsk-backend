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
      },
    ],

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

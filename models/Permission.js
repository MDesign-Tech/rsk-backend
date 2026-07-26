const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module is required'],
    },
    canCreate: {
      type: Boolean,
      default: false,
    },
    canRead: {
      type: Boolean,
      default: false,
    },
    canUpdate: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one permission per user-module combination
permissionSchema.index({ user: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);

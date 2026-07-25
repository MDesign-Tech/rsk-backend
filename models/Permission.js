const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module reference is required'],
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

// Compound index to ensure one permission record per user-module pair
permissionSchema.index({ user: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);

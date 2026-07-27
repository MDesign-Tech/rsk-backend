const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
      index: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration time is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

passwordResetSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp.toString(), salt);
});

passwordResetSchema.methods.matchOTP = async function (enteredOTP) {
  return await bcrypt.compare(enteredOTP.toString(), this.otp);
};

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);

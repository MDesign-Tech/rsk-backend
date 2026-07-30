const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Module = require('../models/Module');
const Permission = require('../models/Permission');
const PasswordReset = require('../models/PasswordReset');
const AboutUs = require('../models/AboutUs');
const { sendOTPEmail } = require('../src/utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const getCompanyInfo = async () => {
  try {
    const about = await AboutUs.findOne();
    if (!about) {
      return {};
    }

    const emailContact = about.contactMethods ? about.contactMethods.find((c) => c.label === 'Email') : null;
    const phoneContact = about.contactMethods ? about.contactMethods.find((c) => c.label === 'Phone') : null;
    const locationContact = about.contactMethods ? about.contactMethods.find((c) => c.label === 'Location') : null;

    return {
      companyName: about.title || 'RSK Associates',
      companyAddress: locationContact ? locationContact.value : 'KIMIRONKO, KG 11 Ave, Kigali',
      companyPhone: phoneContact ? phoneContact.value : '+250 788 492 529',
      companyEmail: emailContact ? emailContact.value : 'info@rsk-associates.com',
      companyLogo: about.logo || 'https://rsk-dev.vercel.app/rsk-logo.svg',
      socialMedia: about.socialMedia || {},
    };
  } catch (error) {
    return {};
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      errors: ['Email or password is incorrect'],
    });
  }

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: parseInt(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        member: user.member,
      },
    },
  });
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
    data: {},
  });
};

const getMe = async (req, res) => {
  try {
    // Re-fetch user with member profile populated
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('member', 'name department position title bio image visible order');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['No user found with this ID'],
      });
    }

    // Get user permissions with module details
    const permissions = await Permission.find({ user: user._id })
      .populate('module', 'name description icon')
      .sort({ module: 1 });

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: {
          ...user.toObject(),
          permissions,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user data',
      errors: [error.message],
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No account exists with this email address'],
    });
  }

  await PasswordReset.deleteMany({ email });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PasswordReset.create({
    email,
    otp,
    expiresAt,
  });

  const companyInfo = await getCompanyInfo();

  try {
    await sendOTPEmail(email, otp, user.name, companyInfo);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP email',
      errors: ['Please try again later'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
    data: {
      email,
      expiresIn: '10 minutes',
    },
  });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const resetRecord = await PasswordReset.findOne({ email });

  if (!resetRecord) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
      errors: ['No OTP request found for this email. Please request a new OTP.'],
    });
  }

  if (resetRecord.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'OTP already used',
      errors: ['This OTP has already been verified. Please request a new one.'],
    });
  }

  if (new Date() > resetRecord.expiresAt) {
    await PasswordReset.deleteMany({ email });
    return res.status(400).json({
      success: false,
      message: 'OTP expired',
      errors: ['This OTP has expired. Please request a new one.'],
    });
  }

  const isOTPValid = await resetRecord.matchOTP(otp);

  if (!isOTPValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
      errors: ['The OTP you entered is incorrect. Please try again.'],
    });
  }

  resetRecord.isVerified = true;
  await resetRecord.save();

  return res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    data: {
      email,
      verified: true,
    },
  });
};

const resendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No account exists with this email address'],
    });
  }

  await PasswordReset.deleteMany({ email });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await PasswordReset.create({
    email,
    otp,
    expiresAt,
  });

  const companyInfo = await getCompanyInfo();

  try {
    await sendOTPEmail(email, otp, user.name, companyInfo);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP email',
      errors: ['Please try again later'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'New OTP sent to your email',
    data: {
      email,
      expiresIn: '10 minutes',
    },
  });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['No user found with this ID'],
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        errors: ['The current password you entered is incorrect'],
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
      errors: [error.message],
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  const resetRecord = await PasswordReset.findOne({ email });

  if (!resetRecord) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request',
      errors: ['No OTP request found for this email. Please request a new OTP.'],
    });
  }

  if (!resetRecord.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'OTP not verified',
      errors: ['Please verify your OTP before resetting your password.'],
    });
  }

  if (new Date() > resetRecord.expiresAt) {
    await PasswordReset.deleteMany({ email });
    return res.status(400).json({
      success: false,
      message: 'OTP expired',
      errors: ['This OTP has expired. Please request a new one.'],
    });
  }

  const isOTPValid = await resetRecord.matchOTP(otp);

  if (!isOTPValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP',
      errors: ['The OTP you entered is incorrect. Please try again.'],
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No account exists with this email address'],
    });
  }

  user.password = password;
  await user.save();

  await PasswordReset.deleteMany({ email });

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully',
    data: {},
  });
};

module.exports = {
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOTP,
  resendOTP,
  resetPassword,
  changePassword,
};

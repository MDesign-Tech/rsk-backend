const express = require('express');
const { body } = require('express-validator');
const {
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOTP,
  resendOTP,
  resetPassword,
} = require('../controllers/authController');
const {
  validateLogin,
  validateForgotPassword,
  validateVerifyOTP,
  validateResendOTP,
  validateResetPassword,
} = require('../validators/authValidator');
const { protect } = require('../middleware/auth');
const { otpLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.post('/forgot-password', otpLimiter, validateForgotPassword, forgotPassword);
router.post('/verify-otp', validateVerifyOTP, verifyOTP);
router.post('/resend-otp', otpLimiter, validateResendOTP, resendOTP);
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;

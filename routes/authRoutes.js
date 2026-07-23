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
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/login', validateLogin, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.post('/forgot-password', otpLimiter, validateForgotPassword, validate, forgotPassword);
router.post('/verify-otp', validateVerifyOTP, validate, verifyOTP);
router.post('/resend-otp', otpLimiter, validateResendOTP, validate, resendOTP);
router.post('/reset-password', validateResetPassword, validate, resetPassword);

module.exports = router;

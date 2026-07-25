const { body } = require('express-validator');

const validateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim(),
  body('memberId')
    .optional()
    .isMongoId().withMessage('Invalid member ID'),
];

module.exports = { validateUser };

module.exports = { validateUser };

const { body } = require('express-validator');

const validateCategory = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
];

// Used for update (partial). All fields optional.
const validateUpdateCategory = [
  body('name')
    .optional()
    .notEmpty().withMessage('Name cannot be empty')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
];

module.exports = { validateCategory, validateUpdateCategory };

const { body } = require('express-validator');

const validateService = [
  body('title')
    .notEmpty().withMessage('Service title is required')
    .trim(),
  body('description')
    .notEmpty().withMessage('Service description is required')
    .trim(),
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
  body('imagePublicId')
    .optional()
    .trim(),
];

module.exports = { validateService };


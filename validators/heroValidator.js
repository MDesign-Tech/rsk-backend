const { body } = require('express-validator');

const validateHero = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  body('subtitle')
    .notEmpty().withMessage('Subtitle is required')
    .trim(),
  body('trust')
    .optional()
    .trim(),
  body('subtitleVisible')
    .optional()
    .isBoolean().withMessage('subtitleVisible must be a boolean')
    .toBoolean(),
  body('trustVisible')
    .optional()
    .isBoolean().withMessage('trustVisible must be a boolean')
    .toBoolean(),
];

module.exports = { validateHero };

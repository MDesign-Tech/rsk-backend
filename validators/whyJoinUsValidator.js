const { body } = require('express-validator');

const validateWhyJoinUs = [
  body('title')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('points')
    .optional()
    .isArray().withMessage('Points must be an array'),
  body('points.*.title')
    .optional()
    .trim(),
  body('points.*.description')
    .optional()
    .trim(),
  body('points.*.visible')
    .optional()
    .isBoolean().withMessage('Point visible must be a boolean'),
  body('points.*.image')
    .optional()
    .isURL().withMessage('Point image must be a valid URL'),
  body('points.*.imagePublicId')
    .optional()
    .trim(),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
];

const validateWhyJoinUsPoint = [
  body('title')
    .optional()
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('visible')
    .optional()
    .isBoolean().withMessage('Point visible must be a boolean'),
];

module.exports = { validateWhyJoinUs, validateWhyJoinUsPoint };

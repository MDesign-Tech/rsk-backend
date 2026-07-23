const { body } = require('express-validator');

const validateWhyBecomeMember = [
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
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
];

module.exports = { validateWhyBecomeMember };

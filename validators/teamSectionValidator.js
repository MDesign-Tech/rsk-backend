const { body } = require('express-validator');

const validateTeamSection = [
  body('name')
    .notEmpty().withMessage('Section name is required')
    .trim()
    .custom(async (value) => {
      const TeamSection = require('../models/TeamSection');
      const existing = await TeamSection.findOne({ name: value });
      if (existing) {
        throw new Error('Section name already exists');
      }
      return true;
    }),
  body('description')
    .optional()
    .trim(),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
];

module.exports = { validateTeamSection };

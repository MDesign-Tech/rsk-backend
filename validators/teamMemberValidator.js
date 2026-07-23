const { body } = require('express-validator');

const validateTeamMember = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim(),
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  body('bio')
    .optional()
    .trim(),
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
  body('imagePublicId')
    .optional()
    .trim(),
  body('section')
    .notEmpty().withMessage('Section is required')
    .isMongoId().withMessage('Section must be a valid ID'),
];

module.exports = { validateTeamMember };

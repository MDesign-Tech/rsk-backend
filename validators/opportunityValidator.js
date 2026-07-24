const { body } = require('express-validator');

const validateOpportunity = [
  body('type')
    .notEmpty().withMessage('Type is required')
    .isMongoId().withMessage('Type must be a valid opportunity type ID'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  body('org')
    .notEmpty().withMessage('Organization is required')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim(),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date'),
  body('image')
    .optional({ nullable: true, empty: true })
    .isURL().withMessage('Image must be a valid URL'),
  body('imagePublicId')
    .optional({ nullable: true, empty: true })
    .isString().withMessage('Image public ID must be a string'),
  body('status')
    .optional()
    .isIn(['Open', 'Closed']).withMessage('Status must be Open or Closed'),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
];

// Used for update (partial). All fields optional.
const validateUpdateOpportunity = [
  body('type')
    .optional()
    .isMongoId().withMessage('Type must be a valid opportunity type ID'),
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .trim(),
  body('org')
    .optional()
    .notEmpty().withMessage('Organization cannot be empty')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim(),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid date'),
  body('image')
    .optional({ nullable: true, empty: true })
    .isURL().withMessage('Image must be a valid URL'),
  body('imagePublicId')
    .optional({ nullable: true, empty: true })
    .isString().withMessage('Image public ID must be a string'),
  body('status')
    .optional()
    .isIn(['Open', 'Closed']).withMessage('Status must be Open or Closed'),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
];

module.exports = { validateOpportunity, validateUpdateOpportunity };

const { body } = require('express-validator');

const validateCreateNewsBlog = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  body('excerpt')
    .notEmpty().withMessage('Excerpt is required')
    .trim()
    .isLength({ max: 300 }).withMessage('Excerpt must be at most 300 characters'),
  body('content')
    .notEmpty().withMessage('Content is required'),
  body('coverImage')
    .notEmpty().withMessage('Cover image is required')
    .isURL().withMessage('Cover image must be a valid URL'),
  body('author')
    .notEmpty().withMessage('Author is required')
    .isObject().withMessage('Author must be an object'),
  body('author.name')
    .notEmpty().withMessage('Author name is required')
    .trim(),
  body('category')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
];

const validateUpdateNewsBlog = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .trim(),
  body('excerpt')
    .optional()
    .notEmpty().withMessage('Excerpt cannot be empty')
    .trim()
    .isLength({ max: 300 }).withMessage('Excerpt must be at most 300 characters'),
  body('content')
    .optional()
    .notEmpty().withMessage('Content cannot be empty'),
  body('coverImage')
    .optional()
    .isURL().withMessage('Cover image must be a valid URL'),
  body('author')
    .optional()
    .isObject().withMessage('Author must be an object'),
  body('author.name')
    .optional()
    .notEmpty().withMessage('Author name cannot be empty')
    .trim(),
  body('category')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
];

const validateStatusToggle = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
];

module.exports = {
  validateCreateNewsBlog,
  validateUpdateNewsBlog,
  validateStatusToggle,
};

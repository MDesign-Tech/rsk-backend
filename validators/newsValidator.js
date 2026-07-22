const { body } = require('express-validator');

// Used for create. The image is uploaded as a multipart file (field name
// "image"), so it is intentionally NOT validated as a body string here.
const validateCreateNews = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  body('excerpt')
    .notEmpty().withMessage('Excerpt is required')
    .trim(),
  body('content')
    .notEmpty().withMessage('Content is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .trim(),
  body('author')
    .notEmpty().withMessage('Author is required')
    .isMongoId().withMessage('Author must be a valid team member ID'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be draft, published, or archived'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
  body('readingTime')
    .optional()
    .isNumeric().withMessage('Reading time must be a number'),
];

// Used for update (partial). All fields optional.
const validateUpdateNews = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .trim(),
  body('excerpt')
    .optional()
    .notEmpty().withMessage('Excerpt cannot be empty')
    .trim(),
  body('content')
    .optional()
    .notEmpty().withMessage('Content cannot be empty'),
  body('category')
    .optional()
    .notEmpty().withMessage('Category cannot be empty')
    .trim(),
  body('author')
    .optional()
    .isMongoId().withMessage('Author must be a valid team member ID'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be draft, published, or archived'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
  body('readingTime')
    .optional()
    .isNumeric().withMessage('Reading time must be a number'),
];

const validateStatusToggle = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be draft, published, or archived'),
];

module.exports = { validateCreateNews, validateUpdateNews, validateStatusToggle };

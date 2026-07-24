const { body } = require('express-validator');

const validateCreateNews = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  body('content')
    .notEmpty().withMessage('Content is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .trim(),
  body('authorId')
    .notEmpty().withMessage('Author is required')
    .isMongoId().withMessage('Author must be a valid team member ID'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('coverImage')
    .optional({ nullable: true, empty: true })
    .isURL().withMessage('Cover image must be a valid URL'),
];

// Used for update (partial). All fields optional.
const validateUpdateNews = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .trim(),
  body('content')
    .optional()
    .notEmpty().withMessage('Content cannot be empty'),
  body('category')
    .optional()
    .trim(),
  body('authorId')
    .optional()
    .isMongoId().withMessage('Author must be a valid team member ID'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('coverImage')
    .optional({ nullable: true, empty: true })
    .isURL().withMessage('Cover image must be a valid URL'),
];

const validateStatusToggle = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
];

module.exports = { validateCreateNews, validateUpdateNews, validateStatusToggle };

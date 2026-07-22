const { body } = require('express-validator');

// Used for create. The image is uploaded as a multipart file (field name
// "image"), so it is intentionally NOT validated as a body string here.
const validateCreateOpportunity = [
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['Tender', 'Job', 'Internship', 'Consultancy', 'RFP', 'RFQ', 'EOI', 'Training', 'Event'])
    .withMessage('Type must be one of: Tender, Job, Internship, Consultancy, RFP, RFQ, EOI, Training, Event'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim(),
  body('org')
    .notEmpty().withMessage('Organization name is required')
    .trim(),
  body('date')
    .notEmpty().withMessage('Deadline is required')
    .isISO8601().withMessage('Deadline must be a valid ISO date'),
  body('shortDescription')
    .notEmpty().withMessage('Short description is required')
    .trim(),
  body('description')
    .notEmpty().withMessage('Description is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .trim(),
  body('location')
    .notEmpty().withMessage('Location is required')
    .trim(),
  body('contactEmail')
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Contact email must be valid'),
  body('contactPhone')
    .notEmpty().withMessage('Contact phone is required')
    .trim(),
  body('status')
    .optional()
    .isIn(['active', 'closed']).withMessage('Status must be active or closed'),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
  body('employmentType')
    .optional()
    .trim(),
  body('salary')
    .optional()
    .trim(),
  body('budget')
    .optional()
    .trim(),
  body('requirements')
    .optional()
    .isString().withMessage('Requirements must be a JSON string'),
  body('benefits')
    .optional()
    .isString().withMessage('Benefits must be a JSON string'),
];

// Used for update (partial). All fields optional.
const validateUpdateOpportunity = [
  body('type')
    .optional()
    .isIn(['Tender', 'Job', 'Internship', 'Consultancy', 'RFP', 'RFQ', 'EOI', 'Training', 'Event'])
    .withMessage('Type must be one of: Tender, Job, Internship, Consultancy, RFP, RFQ, EOI, Training, Event'),
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .trim(),
  body('org')
    .optional()
    .notEmpty().withMessage('Organization name cannot be empty')
    .trim(),
  body('date')
    .optional()
    .isISO8601().withMessage('Deadline must be a valid ISO date'),
  body('shortDescription')
    .optional()
    .notEmpty().withMessage('Short description cannot be empty')
    .trim(),
  body('description')
    .optional()
    .notEmpty().withMessage('Description cannot be empty'),
  body('category')
    .optional()
    .notEmpty().withMessage('Category cannot be empty')
    .trim(),
  body('location')
    .optional()
    .notEmpty().withMessage('Location cannot be empty')
    .trim(),
  body('contactEmail')
    .optional()
    .isEmail().withMessage('Contact email must be valid'),
  body('contactPhone')
    .optional()
    .notEmpty().withMessage('Contact phone cannot be empty')
    .trim(),
  body('status')
    .optional()
    .isIn(['active', 'closed']).withMessage('Status must be active or closed'),
  body('visible')
    .optional()
    .isBoolean().withMessage('Visible must be a boolean'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
  body('employmentType')
    .optional()
    .trim(),
  body('salary')
    .optional()
    .trim(),
  body('budget')
    .optional()
    .trim(),
  body('requirements')
    .optional()
    .isString().withMessage('Requirements must be a JSON string'),
  body('benefits')
    .optional()
    .isString().withMessage('Benefits must be a JSON string'),
];

const validateStatusToggle = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Open', 'Closed']).withMessage('Status must be Open or Closed'),
];

module.exports = {
  validateCreateOpportunity,
  validateUpdateOpportunity,
  validateStatusToggle,
};

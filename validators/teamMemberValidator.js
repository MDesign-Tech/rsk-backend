const { body } = require('express-validator');

// Used for create/update. The image is now uploaded as a multipart file (field
// name "image"), so it is intentionally NOT validated as a body string here.
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
];

module.exports = { validateTeamMember };

const { body } = require('express-validator');

// Used for full create/update (PUT /api/hero). All fields optional so partial
// updates (e.g. toggling visibility) are allowed without re-sending title/subtitle.
const validateHero = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .trim(),
  body('subtitle')
    .optional()
    .notEmpty().withMessage('Subtitle cannot be empty')
    .trim(),
  body('trust')
    .optional()
    .trim(),
  body('subtitleVisible')
    .optional()
    .isBoolean().withMessage('subtitleVisible must be a boolean')
    .toBoolean(),
  body('trustVisible')
    .optional()
    .isBoolean().withMessage('trustVisible must be a boolean')
    .toBoolean(),
];

module.exports = { validateHero };

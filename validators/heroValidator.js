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

// Used for PATCH /api/hero/visibility/subtitle
const validateSubtitleVisibility = [
  body('subtitleVisible')
    .exists().withMessage('subtitleVisible is required')
    .isBoolean().withMessage('subtitleVisible must be a boolean')
    .toBoolean(),
];

// Used for PATCH /api/hero/visibility/trust
const validateTrustVisibility = [
  body('trustVisible')
    .exists().withMessage('trustVisible is required')
    .isBoolean().withMessage('trustVisible must be a boolean')
    .toBoolean(),
];

module.exports = {
  validateHero,
  validateSubtitleVisibility,
  validateTrustVisibility,
};

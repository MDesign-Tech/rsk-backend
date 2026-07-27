const { body } = require('express-validator');

// Used for full create/update (PUT /api/hero). All fields optional so partial
// updates (e.g. toggling visibility) are allowed without re-sending title/services.
const validateHero = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .trim(),
  body('services')
    .optional()
    .isArray().withMessage('Services must be an array')
    .custom((items) => {
      if (!Array.isArray(items)) return true;
      for (const item of items) {
        if (!item.text || typeof item.text !== 'string' || item.text.trim() === '') {
          throw new Error('Each service item must have a non-empty text string');
        }
      }
      return true;
    }),
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
  body('imagePublicId')
    .optional()
    .trim(),
];

module.exports = {
  validateHero,
};

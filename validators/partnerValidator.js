const { body } = require('express-validator');

const validatePartner = [
  body('name')
    .notEmpty().withMessage('Partner name is required')
    .trim(),
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
  body('imagePublicId')
    .optional()
    .trim(),
];

module.exports = { validatePartner };

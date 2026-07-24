const { body } = require('express-validator');

const validatePartner = [
  body('name')
    .notEmpty().withMessage('Partner name is required')
    .trim(),
  body('image')
    .optional({ nullable: true, empty: true })
    .isURL({ require_protocol: false }).withMessage('Image must be a valid URL'),
  body('imagePublicId')
    .optional({ nullable: true, empty: true })
    .trim(),
];

module.exports = { validatePartner };

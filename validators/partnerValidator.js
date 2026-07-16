const { body } = require('express-validator');

const validatePartner = [
  body('name')
    .notEmpty().withMessage('Partner name is required')
    .trim(),
  body('image')
    .optional()
    .trim(),
];

module.exports = { validatePartner };

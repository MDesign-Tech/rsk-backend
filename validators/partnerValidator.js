const { body } = require('express-validator');

// Used for create/update. The image is now uploaded as a multipart file (field
// name "image"), so it is intentionally NOT validated as a body string here.
const validatePartner = [
  body('name')
    .notEmpty().withMessage('Partner name is required')
    .trim(),
];

module.exports = { validatePartner };

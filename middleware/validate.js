const { validationResult } = require('express-validator');

// Middleware that runs after express-validator checks and returns 400 on errors.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

module.exports = validate;

const { body } = require('express-validator');


const validateAbout = [

  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),


  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),


  body('stats')
    .optional()
    .isArray()
    .withMessage('Stats must be array'),


  body('contactMethods')
    .optional()
    .isArray()
    .withMessage('Contact methods must be array'),


  body('socialMedia')
    .optional()
    .isObject()
    .withMessage('Social media must be an object'),

  body('socialMedia.facebook')
    .optional()
    .isObject()
    .withMessage('Facebook must be an object'),

  body('socialMedia.instagram')
    .optional()
    .isObject()
    .withMessage('Instagram must be an object'),

  body('socialMedia.whatsapp')
    .optional()
    .isObject()
    .withMessage('WhatsApp must be an object'),

  body('socialMedia.x')
    .optional()
    .isObject()
    .withMessage('X must be an object'),

  body('socialMedia.linkedin')
    .optional()
    .isObject()
    .withMessage('LinkedIn must be an object'),

  body('socialMedia.youtube')
    .optional()
    .isObject()
    .withMessage('YouTube must be an object'),


];


module.exports = {
  validateAbout,
};
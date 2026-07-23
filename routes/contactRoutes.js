const express = require('express');
const { body } = require('express-validator');
const {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  deleteContactMessage,
  replyToMessage,
} = require('../controllers/contactController');
const { validateContact } = require('../validators/contactValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/', validateContact, validate, createContactMessage);

router.use(protect);

router.get('/', getContactMessages);
router.get('/:id', getContactMessage);
router.delete('/:id', deleteContactMessage);
router.post('/:id/reply', body('reply').notEmpty().withMessage('Reply is required').trim(), validate, replyToMessage);

module.exports = router;

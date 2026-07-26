const express = require('express');
const { body } = require('express-validator');
const {
  createContactMessage,
  getConversations,
  getConversation,
  sendMessage,
  getContactMessages,
  getContactMessage,
  deleteContactMessage,
  replyToMessage,
} = require('../controllers/contactController');
const { validateContact } = require('../validators/contactValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Public route - client submits contact form
router.post('/', validateContact, validate, createContactMessage);

// Protected routes - admin only
router.use(protect);

// New conversation-based routes
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.post('/conversations/:id/messages', body('message').notEmpty().withMessage('Message is required').trim(), validate, sendMessage);

// Legacy routes - kept for backward compatibility
router.get('/', getContactMessages);
router.get('/:id', getContactMessage);
router.delete('/:id', deleteContactMessage);
router.post('/:id/reply', body('reply').notEmpty().withMessage('Reply is required').trim(), validate, replyToMessage);

module.exports = router;

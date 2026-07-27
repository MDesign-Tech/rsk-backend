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
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

// Public route - client submits contact form
router.post('/', validateContact, validate, createContactMessage);

// Protected routes - admin only
router.use(protect);

// New conversation-based routes
router.get('/conversations', authorize('Contact', 'read'), getConversations);
router.get('/conversations/:id', authorize('Contact', 'read'), getConversation);
router.post('/conversations/:id/messages', authorize('Contact', 'update'), body('message').notEmpty().withMessage('Message is required').trim(), validate, sendMessage);

// Legacy routes - kept for backward compatibility
router.get('/', authorize('Contact', 'read'), getContactMessages);
router.get('/:id', authorize('Contact', 'read'), getContactMessage);
router.delete('/:id', authorize('Contact', 'delete'), deleteContactMessage);
router.post('/:id/reply', authorize('Contact', 'update'), body('reply').notEmpty().withMessage('Reply is required').trim(), validate, replyToMessage);

module.exports = router;

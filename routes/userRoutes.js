const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUser,
  getAvailableMembers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// User management routes require User module read permission
router.get('/', authorize('User', 'read'), getUsers);
router.get('/available-members', authorize('User', 'read'), getAvailableMembers);
router.get('/:id', authorize('User', 'read'), getUser);
router.post('/', authorize('User', 'create'), validateUser, validate, createUser);
router.put('/:id', authorize('User', 'update'), validateUser, validate, updateUser);
router.delete('/:id', authorize('User', 'delete'), deleteUser);

module.exports = router;

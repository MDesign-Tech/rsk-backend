const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { validateUser } = require('../validators/userValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', validateUser, validate, createUser);
router.put('/:id', validateUser, validate, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;


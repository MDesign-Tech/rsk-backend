const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { validateCategory, validateUpdateCategory } = require('../validators/categoryValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', validateCategory, validate, createCategory);
router.put('/:id', validateUpdateCategory, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

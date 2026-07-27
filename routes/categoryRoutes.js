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
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Category', 'read'), getCategories);
router.get('/:id', authorize('Category', 'read'), getCategory);
router.post('/', authorize('Category', 'create'), validateCategory, validate, createCategory);
router.put('/:id', authorize('Category', 'update'), validateUpdateCategory, validate, updateCategory);
router.delete('/:id', authorize('Category', 'delete'), deleteCategory);

module.exports = router;

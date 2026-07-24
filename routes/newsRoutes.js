const express = require('express');
const {
  listArticles,
  listPublicArticles,
  getArticleById,
  getArticleBySlug,
  getArticlesByCategory,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleStatus,
} = require('../controllers/newsController');
const {
  validateCreateNews,
  validateUpdateNews,
  validateStatusToggle,
} = require('../validators/newsValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ---- Public routes (no auth) ----
router.get('/public', listPublicArticles);
router.get('/public/:slug', getArticleBySlug);
router.get('/category/:categoryId', getArticlesByCategory);

// ---- Admin routes (auth required) ----
router.use(protect);

router.get('/', listArticles);
router.get('/:id', getArticleById);
router.post(
  '/',
  validateCreateNews,
  validate,
  createArticle
);
router.put(
  '/:id',
  validateUpdateNews,
  validate,
  updateArticle
);
router.patch(
  '/:id/status',
  validateStatusToggle,
  validate,
  toggleArticleStatus
);
router.delete('/:id', deleteArticle);

module.exports = router;

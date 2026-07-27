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
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

// ---- Public routes (no auth) ----
router.get('/public', listPublicArticles);
router.get('/public/:slug', getArticleBySlug);
router.get('/category/:categoryId', getArticlesByCategory);

// ---- Admin routes (auth required) ----
router.use(protect);

router.get('/', authorize('News', 'read'), listArticles);
router.get('/:id', authorize('News', 'read'), getArticleById);
router.post(
  '/',
  authorize('News', 'create'),
  validateCreateNews,
  validate,
  createArticle
);
router.put(
  '/:id',
  authorize('News', 'update'),
  validateUpdateNews,
  validate,
  updateArticle
);
router.patch(
  '/:id/status',
  authorize('News', 'update'),
  validateStatusToggle,
  validate,
  toggleArticleStatus
);
router.delete('/:id', authorize('News', 'delete'), deleteArticle);

module.exports = router;

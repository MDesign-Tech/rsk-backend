const express = require('express');
const {
  listArticles,
  listPublicArticles,
  getArticleById,
  getArticleBySlug,
  getFeaturedArticles,
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
const { upload, multerErrorHandler } = require('../middleware/upload');

const router = express.Router();

// ---- Public routes (no auth) ----
router.get('/public', listPublicArticles);
router.get('/public/:slug', getArticleBySlug);
router.get('/featured', getFeaturedArticles);
router.get('/category/:category', getArticlesByCategory);

// ---- Admin routes (auth required) ----
router.use(protect);

router.get('/', listArticles);
router.get('/:id', getArticleById);
router.post(
  '/',
  upload.single('image'),
  multerErrorHandler,
  validateCreateNews,
  createArticle
);
router.put(
  '/:id',
  upload.single('image'),
  multerErrorHandler,
  validateUpdateNews,
  updateArticle
);
router.patch(
  '/:id/status',
  validateStatusToggle,
  toggleArticleStatus
);
router.delete('/:id', deleteArticle);

module.exports = router;

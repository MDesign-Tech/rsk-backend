const express = require('express');
const {
  listPublicNews,
  getNewsBySlug,
  listAdminNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
} = require('../controllers/newsBlogController');
const {
  validateCreateNewsBlog,
  validateUpdateNewsBlog,
  validateStatusToggle,
} = require('../validators/newsBlogValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ---- Public routes (no auth) ----
router.get('/', listPublicNews);
router.get('/:slug', getNewsBySlug);

// ---- Admin routes (auth required) ----
router.use(protect);

router.get('/admin', listAdminNews);
router.get('/admin/:id', getNewsById);
router.post('/', validateCreateNewsBlog, validate, createNews);
router.put('/:id', validateUpdateNewsBlog, validate, updateNews);
router.patch('/:id/status', validateStatusToggle, validate, toggleNewsStatus);
router.delete('/:id', deleteNews);

module.exports = router;

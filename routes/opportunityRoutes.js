const express = require('express');
const {
  listPublicOpportunities,
  listAdminOpportunities,
  getOpportunityById,
  getOpportunityBySlug,
  getFeaturedOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  toggleOpportunityStatus,
} = require('../controllers/opportunityController');
const {
  validateCreateOpportunity,
  validateUpdateOpportunity,
  validateStatusToggle,
} = require('../validators/opportunityValidator');
const { protect } = require('../middleware/auth');
const { upload, multerErrorHandler } = require('../middleware/upload');

const router = express.Router();

// ---- Public routes (no auth) ----
router.get('/public', listPublicOpportunities);
router.get('/public/:slug', getOpportunityBySlug);
router.get('/featured', getFeaturedOpportunities);

// ---- Admin routes (auth required) ----
router.use(protect);

router.get('/admin', listAdminOpportunities);
router.get('/:id', getOpportunityById);
router.post(
  '/',
  upload.single('image'),
  multerErrorHandler,
  validateCreateOpportunity,
  createOpportunity
);
router.put(
  '/:id',
  upload.single('image'),
  multerErrorHandler,
  validateUpdateOpportunity,
  updateOpportunity
);
router.patch(
  '/:id/status',
  validateStatusToggle,
  toggleOpportunityStatus
);
router.delete('/:id', deleteOpportunity);

module.exports = router;

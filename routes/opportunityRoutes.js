const express = require('express');
const {
  listOpportunities,
  listPublicOpportunities,
  getOpportunityById,
  getOpportunityBySlug,
  getOpportunitiesByCategory,
  getOpportunitiesByType,
  getOpportunityTypes,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  deleteOpportunitiesByType,
  toggleOpportunityStatus,
  toggleOpportunityVisibility,
} = require('../controllers/opportunityController');
const {
  validateOpportunity,
  validateUpdateOpportunity,
} = require('../validators/opportunityValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ---- Public routes (no auth) ----
router.get('/public', listPublicOpportunities);
router.get('/public/:slug', getOpportunityBySlug);
router.get('/category/:category', getOpportunitiesByCategory);
router.get('/type/:typeId', getOpportunitiesByType);
router.get('/types', getOpportunityTypes);

// ---- Admin routes (auth required) ----
router.use(protect);

router.get('/', listOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', validateOpportunity, validate, createOpportunity);
router.put('/:id', validateUpdateOpportunity, validate, updateOpportunity);
router.delete('/type/:typeId', deleteOpportunitiesByType);
router.delete('/:id', deleteOpportunity);
router.patch('/:id/status', toggleOpportunityStatus);
router.patch('/:id/visibility', toggleOpportunityVisibility);

module.exports = router;

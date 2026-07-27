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
const { authorize } = require('../middleware/authorize');
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

router.get('/', authorize('Opportunity', 'read'), listOpportunities);
router.get('/:id', authorize('Opportunity', 'read'), getOpportunityById);
router.post('/', authorize('Opportunity', 'create'), validateOpportunity, validate, createOpportunity);
router.put('/:id', authorize('Opportunity', 'update'), validateUpdateOpportunity, validate, updateOpportunity);
router.delete('/type/:typeId', authorize('Opportunity', 'delete'), deleteOpportunitiesByType);
router.delete('/:id', authorize('Opportunity', 'delete'), deleteOpportunity);
router.patch('/:id/status', authorize('Opportunity', 'update'), toggleOpportunityStatus);
router.patch('/:id/visibility', authorize('Opportunity', 'update'), toggleOpportunityVisibility);

module.exports = router;

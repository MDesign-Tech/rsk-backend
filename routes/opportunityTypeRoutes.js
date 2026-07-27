const express = require('express');
const {
  getOpportunityTypes,
  getOpportunityType,
  createOpportunityType,
  updateOpportunityType,
  deleteOpportunityType,
} = require('../controllers/opportunityTypeController');
const { validateOpportunityType, validateUpdateOpportunityType } = require('../validators/opportunityTypeValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Opportunity Type', 'read'), getOpportunityTypes);
router.get('/:id', authorize('Opportunity Type', 'read'), getOpportunityType);
router.post('/', authorize('Opportunity Type', 'create'), validateOpportunityType, validate, createOpportunityType);
router.put('/:id', authorize('Opportunity Type', 'update'), validateUpdateOpportunityType, validate, updateOpportunityType);
router.delete('/:id', authorize('Opportunity Type', 'delete'), deleteOpportunityType);

module.exports = router;

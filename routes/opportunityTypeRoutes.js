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
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getOpportunityTypes);
router.get('/:id', getOpportunityType);
router.post('/', validateOpportunityType, validate, createOpportunityType);
router.put('/:id', validateUpdateOpportunityType, validate, updateOpportunityType);
router.delete('/:id', deleteOpportunityType);

module.exports = router;

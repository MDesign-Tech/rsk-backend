const express = require('express');
const { body } = require('express-validator');
const {
  getPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  togglePartnerVisibility,
} = require('../controllers/partnerController');
const { validatePartner } = require('../validators/partnerValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Partner', 'read'), getPartners);
router.get('/:id', authorize('Partner', 'read'), getPartner);
router.post('/', authorize('Partner', 'create'), validatePartner, validate, createPartner);
router.put(
  '/:id',
  authorize('Partner', 'update'),
  validatePartner,
  validate,
  updatePartner
);
router.delete('/:id', authorize('Partner', 'delete'), deletePartner);
router.patch('/:id/visibility', authorize('Partner', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), togglePartnerVisibility);

module.exports = router;

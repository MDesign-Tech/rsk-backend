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

const router = express.Router();

router.use(protect);

router.get('/', getPartners);
router.get('/:id', getPartner);
router.post('/', validatePartner, createPartner);
router.put('/:id', validatePartner, updatePartner);
router.delete('/:id', deletePartner);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), togglePartnerVisibility);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const {
  getPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  togglePartnerVisibility,
  upload,
} = require('../controllers/partnerController');
const { validatePartner } = require('../validators/partnerValidator');
const { protect } = require('../middleware/auth');
const { multerErrorHandler } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', getPartners);
router.get('/:id', getPartner);
router.post('/', validatePartner, createPartner);
// PUT /partners/:id now handles both content and (optional) image updates.
router.put(
  '/:id',
  upload.single('image'),
  multerErrorHandler,
  validatePartner,
  updatePartner
);
router.delete('/:id', deletePartner);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), togglePartnerVisibility);

module.exports = router;

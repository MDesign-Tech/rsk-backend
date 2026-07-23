const express = require('express');
const { body } = require('express-validator');
const {
  getWhyJoinUs,
  createWhyJoinUs,
  updateWhyJoinUs,
  deleteWhyJoinUs,
  toggleWhyJoinUsVisibility,
} = require('../controllers/whyJoinUsController');
const { validateWhyJoinUs } = require('../validators/whyJoinUsValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getWhyJoinUs);
router.post('/', validateWhyJoinUs, validate, createWhyJoinUs);
router.put('/', validateWhyJoinUs, validate, updateWhyJoinUs);
router.delete('/', deleteWhyJoinUs);
router.patch('/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleWhyJoinUsVisibility);

module.exports = router;

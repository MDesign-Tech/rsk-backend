const express = require('express');
const { body } = require('express-validator');
const {
  getWhyJoinUs,
  createWhyJoinUs,
  updateWhyJoinUs,
  deleteWhyJoinUs,
  toggleWhyJoinUsVisibility,
  getPoints,
  createPoint,
  updatePoint,
  deletePoint,
  togglePointVisibility,
} = require('../controllers/whyJoinUsController');
const { validateWhyJoinUs, validateWhyJoinUsPoint } = require('../validators/whyJoinUsValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// Section routes
router.get('/', getWhyJoinUs);
router.post('/', validateWhyJoinUs, validate, createWhyJoinUs);
router.put('/', validateWhyJoinUs, validate, updateWhyJoinUs);
router.delete('/', deleteWhyJoinUs);
router.patch('/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleWhyJoinUsVisibility);

// Point routes
router.get('/points', getPoints);
router.post('/points', validateWhyJoinUsPoint, validate, createPoint);
router.put('/points/:id', validateWhyJoinUsPoint, validate, updatePoint);
router.delete('/points/:id', deletePoint);
router.patch('/points/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), togglePointVisibility);

module.exports = router;

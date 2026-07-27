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
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// Section routes
router.get('/', authorize('Why Join Us', 'read'), getWhyJoinUs);
router.post('/', authorize('Why Join Us', 'create'), validateWhyJoinUs, validate, createWhyJoinUs);
router.put('/', authorize('Why Join Us', 'update'), validateWhyJoinUs, validate, updateWhyJoinUs);
router.delete('/', authorize('Why Join Us', 'delete'), deleteWhyJoinUs);
router.patch('/visibility', authorize('Why Join Us', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), toggleWhyJoinUsVisibility);

// Point routes
router.get('/points', authorize('Why Join Us', 'read'), getPoints);
router.post('/points', authorize('Why Join Us', 'create'), validateWhyJoinUsPoint, validate, createPoint);
router.put('/points/:id', authorize('Why Join Us', 'update'), validateWhyJoinUsPoint, validate, updatePoint);
router.delete('/points/:id', authorize('Why Join Us', 'delete'), deletePoint);
router.patch('/points/:id/visibility', authorize('Why Join Us', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), togglePointVisibility);

module.exports = router;

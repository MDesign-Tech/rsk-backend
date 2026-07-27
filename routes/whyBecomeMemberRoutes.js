const express = require('express');
const { body } = require('express-validator');
const {
  getWhyBecomeMember,
  createWhyBecomeMember,
  updateWhyBecomeMember,
  deleteWhyBecomeMember,
  toggleWhyBecomeMemberVisibility,
  getPoints,
  createPoint,
  updatePoint,
  deletePoint,
  togglePointVisibility,
} = require('../controllers/whyBecomeMemberController');
const { validateWhyBecomeMember, validateWhyBecomeMemberPoint } = require('../validators/whyBecomeMemberValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// Section routes
router.get('/', authorize('Why Become Member', 'read'), getWhyBecomeMember);
router.post('/', authorize('Why Become Member', 'create'), validateWhyBecomeMember, validate, createWhyBecomeMember);
router.put('/', authorize('Why Become Member', 'update'), validateWhyBecomeMember, validate, updateWhyBecomeMember);
router.delete('/', authorize('Why Become Member', 'delete'), deleteWhyBecomeMember);
router.patch('/visibility', authorize('Why Become Member', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), toggleWhyBecomeMemberVisibility);

// Point routes
router.get('/points', authorize('Why Become Member', 'read'), getPoints);
router.post('/points', authorize('Why Become Member', 'create'), validateWhyBecomeMemberPoint, validate, createPoint);
router.put('/points/:id', authorize('Why Become Member', 'update'), validateWhyBecomeMemberPoint, validate, updatePoint);
router.delete('/points/:id', authorize('Why Become Member', 'delete'), deletePoint);
router.patch('/points/:id/visibility', authorize('Why Become Member', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), togglePointVisibility);

module.exports = router;

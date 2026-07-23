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
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// Section routes
router.get('/', getWhyBecomeMember);
router.post('/', validateWhyBecomeMember, validate, createWhyBecomeMember);
router.put('/', validateWhyBecomeMember, validate, updateWhyBecomeMember);
router.delete('/', deleteWhyBecomeMember);
router.patch('/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleWhyBecomeMemberVisibility);

// Point routes
router.get('/points', getPoints);
router.post('/points', validateWhyBecomeMemberPoint, validate, createPoint);
router.put('/points/:id', validateWhyBecomeMemberPoint, validate, updatePoint);
router.delete('/points/:id', deletePoint);
router.patch('/points/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), togglePointVisibility);

module.exports = router;

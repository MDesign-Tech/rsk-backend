const express = require('express');
const { body } = require('express-validator');
const {
  getWhyBecomeMember,
  createWhyBecomeMember,
  updateWhyBecomeMember,
  deleteWhyBecomeMember,
  toggleWhyBecomeMemberVisibility,
} = require('../controllers/whyBecomeMemberController');
const { validateWhyBecomeMember } = require('../validators/whyBecomeMemberValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getWhyBecomeMember);
router.post('/', validateWhyBecomeMember, validate, createWhyBecomeMember);
router.put('/', validateWhyBecomeMember, validate, updateWhyBecomeMember);
router.delete('/', deleteWhyBecomeMember);
router.patch('/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleWhyBecomeMemberVisibility);

module.exports = router;

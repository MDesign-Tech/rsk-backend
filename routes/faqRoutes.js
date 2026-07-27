const express = require('express');
const { body } = require('express-validator');
const { getFAQs, getFAQ, createFAQ, updateFAQ, deleteFAQ, toggleFAQVisibility } = require('../controllers/faqController');
const { validateFAQ } = require('../validators/faqValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('FAQ', 'read'), getFAQs);
router.get('/:id', authorize('FAQ', 'read'), getFAQ);
router.post('/', authorize('FAQ', 'create'), validateFAQ, validate, createFAQ);
router.put('/:id', authorize('FAQ', 'update'), validateFAQ, validate, updateFAQ);
router.delete('/:id', authorize('FAQ', 'delete'), deleteFAQ);
router.patch('/:id/visibility', authorize('FAQ', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), toggleFAQVisibility);

module.exports = router;

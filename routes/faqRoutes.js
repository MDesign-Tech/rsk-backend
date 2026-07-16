const express = require('express');
const { body } = require('express-validator');
const { getFAQs, getFAQ, createFAQ, updateFAQ, deleteFAQ, toggleFAQVisibility } = require('../controllers/faqController');
const { validateFAQ } = require('../validators/faqValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getFAQs);
router.get('/:id', getFAQ);
router.post('/', validateFAQ, createFAQ);
router.put('/:id', validateFAQ, updateFAQ);
router.delete('/:id', deleteFAQ);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleFAQVisibility);

module.exports = router;

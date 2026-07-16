const express = require('express');
const { body } = require('express-validator');
const { getHero, updateHero, uploadHeroImage, toggleSubtitleVisibility, toggleTrustVisibility } = require('../controllers/heroController');
const { validateHero } = require('../validators/heroValidator');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', getHero);
router.put('/', validateHero, updateHero);
router.post('/upload', upload.single('image'), uploadHeroImage);
router.patch('/subtitle/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleSubtitleVisibility);
router.patch('/trust/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleTrustVisibility);

module.exports = router;

const express = require('express');
const { getHero, updateHero, uploadHeroImage } = require('../controllers/heroController');
const { validateHero } = require('../validators/heroValidator');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getHero);
router.put('/', validateHero, validate, updateHero);
router.post('/upload', upload.single('image'), uploadHeroImage);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const { getAbout, updateAbout, toggleAboutVisibility } = require('../controllers/aboutController');
const { validateAbout } = require('../validators/aboutValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAbout);
router.put('/', validateAbout, updateAbout);
router.patch('/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleAboutVisibility);

module.exports = router;

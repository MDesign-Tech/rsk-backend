const express = require('express');
const { body, param } = require('express-validator');
const { getAbout, updateAbout, toggleAboutVisibility, toggleStatVisibility, toggleContactMethodVisibility } = require('../controllers/aboutController');
const { validateAbout } = require('../validators/aboutValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

//all routes

router.get('/', authorize('About Us', 'read'), getAbout);
router.put('/', authorize('About Us', 'update'), validateAbout, validate, updateAbout);
router.patch('/visibility', authorize('About Us', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), toggleAboutVisibility);

module.exports = router;

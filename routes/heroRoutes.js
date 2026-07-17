const express = require('express');
const { updateHero, getHero, upload } = require('../controllers/heroController');
const { validateHero } = require('../validators/heroValidator');
const { protect } = require('../middleware/auth');
const { multerErrorHandler } = require('../middleware/upload');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getHero);
// PUT /hero now handles both content and (optional) image updates in one request.
router.put(
  '/',
  upload.single('image'),
  multerErrorHandler,
  validateHero,
  validate,
  updateHero
);

module.exports = router;

const express = require('express');
const { updateHero, getHero, updateSubtitleVisibility, updateTrustVisibility } = require('../controllers/heroController');
const { validateHero, validateSubtitleVisibility, validateTrustVisibility } = require('../validators/heroValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getHero);
// PUT /hero now handles content and image URL updates in one request.
router.put(
  '/',
  validateHero,
  validate,
  updateHero
);

// PATCH /hero/visibility/subtitle - Updates only the subtitle visibility flag.
router.patch(
  '/visibility/subtitle',
  validateSubtitleVisibility,
  validate,
  updateSubtitleVisibility
);

// PATCH /hero/visibility/trust - Updates only the trust visibility flag.
router.patch(
  '/visibility/trust',
  validateTrustVisibility,
  validate,
  updateTrustVisibility
);

module.exports = router;

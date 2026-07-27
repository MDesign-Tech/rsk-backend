const express = require('express');
const { updateHero, getHero } = require('../controllers/heroController');
const { validateHero } = require('../validators/heroValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Hero', 'read'), getHero);
// PUT /hero now handles content and image URL updates in one request.
router.put(
  '/',
  authorize('Hero', 'update'),
  validateHero,
  validate,
  updateHero
);

module.exports = router;

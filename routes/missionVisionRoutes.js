const express = require('express');
const { body } = require('express-validator');
const { getMissionVision, updateMissionVision, toggleMissionVisionVisibility } = require('../controllers/missionVisionController');
const { validateMissionVision } = require('../validators/missionVisionValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getMissionVision);
router.put('/', validateMissionVision, updateMissionVision);
router.patch('/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleMissionVisionVisibility);

module.exports = router;

const express = require('express');
const { getMissionVision, updateMissionVision } = require('../controllers/missionVisionController');
const { validateMissionVision } = require('../validators/missionVisionValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getMissionVision);
router.put('/', validateMissionVision, validate, updateMissionVision);

module.exports = router;

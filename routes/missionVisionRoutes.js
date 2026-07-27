const express = require('express');
const { getMissionVision, updateMissionVision } = require('../controllers/missionVisionController');
const { validateMissionVision } = require('../validators/missionVisionValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Mission & Vision', 'read'), getMissionVision);
router.put('/', authorize('Mission & Vision', 'update'), validateMissionVision, validate, updateMissionVision);

module.exports = router;

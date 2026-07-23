const express = require('express');
const { body } = require('express-validator');
const {
  getTeamSections,
  getTeamSection,
  createTeamSection,
  updateTeamSection,
  deleteTeamSection,
  toggleTeamSectionVisibility,
} = require('../controllers/teamSectionController');
const { validateTeamSection } = require('../validators/teamSectionValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getTeamSections);
router.get('/:id', getTeamSection);
router.post('/', validateTeamSection, validate, createTeamSection);
router.put('/:id', validateTeamSection, validate, updateTeamSection);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleTeamSectionVisibility);
router.delete('/:id', deleteTeamSection);

module.exports = router;

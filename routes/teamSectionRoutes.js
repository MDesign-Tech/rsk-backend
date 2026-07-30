const express = require('express');
const { body } = require('express-validator');
const {
  getTeamSections,
  getTeamSection,
  createTeamSection,
  updateTeamSection,
  deleteTeamSection,
  toggleTeamSectionVisibility,
  reorderSections,
} = require('../controllers/teamSectionController');
const { validateCreateTeamSection, validateUpdateTeamSection } = require('../validators/teamSectionValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Team Section', 'read'), getTeamSections);
router.get('/:id', authorize('Team Section', 'read'), getTeamSection);
router.post('/', authorize('Team Section', 'create'), validateCreateTeamSection, validate, createTeamSection);
router.put('/:id', authorize('Team Section', 'update'), validateUpdateTeamSection, validate, updateTeamSection);
router.patch('/:id/visibility', authorize('Team Section', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), toggleTeamSectionVisibility);
router.delete('/:id', authorize('Team Section', 'delete'), deleteTeamSection);
router.patch('/reorder', authorize('Team Section', 'update'), body('order').isArray().exists({ checkFalsy: true }), reorderSections);

module.exports = router;

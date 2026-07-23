const express = require('express');
const { body } = require('express-validator');
const {
  getTeamMembers,
  getPublicTeam,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberVisibility,
} = require('../controllers/teamMemberController');
const { validateTeamMember } = require('../validators/teamMemberValidator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/public', getPublicTeam);

// Protected admin endpoints
router.use(protect);

router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);
router.post(
  '/',
  validateTeamMember,
  validate,
  createTeamMember
);
router.put(
  '/:id',
  validateTeamMember,
  validate,
  updateTeamMember
);
router.delete('/:id', deleteTeamMember);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleTeamMemberVisibility);

module.exports = router;

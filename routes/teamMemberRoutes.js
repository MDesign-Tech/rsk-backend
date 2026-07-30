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
  moveTeamMember,
  reorderMembers,
} = require('../controllers/teamMemberController');
const { validateTeamMember } = require('../validators/teamMemberValidator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

// Public route - no auth required
router.get('/public', getPublicTeam);

// Protected admin endpoints
router.use(protect);

// Team member management routes require Team Member module read permission
router.get('/', authorize('Team Member', 'read'), getTeamMembers);
router.get('/:id', authorize('Team Member', 'read'), getTeamMember);
router.post(
  '/',
  authorize('Team Member', 'create'),
  validateTeamMember,
  validate,
  createTeamMember
);
router.put(
  '/:id',
  authorize('Team Member', 'update'),
  validateTeamMember,
  validate,
  updateTeamMember
);
router.delete('/:id', authorize('Team Member', 'delete'), deleteTeamMember);
router.patch('/:id/visibility', authorize('Team Member', 'update'), body('visible').isBoolean().exists({ checkFalsy: true }), toggleTeamMemberVisibility);
router.patch('/reorder', authorize('Team Member', 'update'), body('order').isArray().exists({ checkFalsy: true }), reorderMembers);
router.patch('/:id/move', authorize('Team Member', 'update'), body('section').isMongoId().exists({ checkFalsy: true }), moveTeamMember);

module.exports = router;

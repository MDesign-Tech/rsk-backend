const express = require('express');
const { body } = require('express-validator');
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberVisibility,
  upload,
} = require('../controllers/teamMemberController');
const { validateTeamMember } = require('../validators/teamMemberValidator');
const { protect } = require('../middleware/auth');
const { multerErrorHandler } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);
router.post('/', validateTeamMember, createTeamMember);
// PUT /team/:id now handles both content and (optional) image updates.
router.put(
  '/:id',
  upload.single('image'),
  multerErrorHandler,
  validateTeamMember,
  updateTeamMember
);
router.delete('/:id', deleteTeamMember);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleTeamMemberVisibility);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadTeamMemberImage,
  toggleTeamMemberVisibility,
} = require('../controllers/teamMemberController');
const { validateTeamMember } = require('../validators/teamMemberValidator');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);
router.post('/', validateTeamMember, createTeamMember);
router.put('/:id', validateTeamMember, updateTeamMember);
router.delete('/:id', deleteTeamMember);
router.post('/:id/upload', upload.single('image'), uploadTeamMemberImage);
router.patch('/:id/visibility', body('visible').isBoolean().exists({ checkFalsy: true }), toggleTeamMemberVisibility);

module.exports = router;

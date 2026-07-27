const express = require('express');
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  linkUserToMember,
  unlinkUserFromMember,
} = require('../controllers/memberController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Team Member', 'read'), getMembers);
router.get('/:id', authorize('Team Member', 'read'), getMember);
router.post('/', authorize('Team Member', 'create'), createMember);
router.put('/:id', authorize('Team Member', 'update'), updateMember);
router.delete('/:id', authorize('Team Member', 'delete'), deleteMember);
router.post('/link/:userId', authorize('Team Member', 'update'), linkUserToMember);
router.post('/unlink/:userId', authorize('Team Member', 'update'), unlinkUserFromMember);

module.exports = router;

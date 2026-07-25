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
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);
router.post('/link/:userId', linkUserToMember);
router.post('/unlink/:userId', unlinkUserFromMember);

module.exports = router;

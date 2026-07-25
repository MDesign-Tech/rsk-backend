const express = require('express');
const {
  getPermissions,
  getUserPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  bulkCreatePermissions,
} = require('../controllers/permissionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getPermissions);
router.get('/user/:userId', getUserPermissions);
router.post('/', createPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);
router.post('/bulk', bulkCreatePermissions);

module.exports = router;

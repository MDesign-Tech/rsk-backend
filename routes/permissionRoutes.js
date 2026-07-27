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
const { authorize } = require('../middleware/authorize');

const router = express.Router();

// All permission routes require authentication
router.use(protect);

// Get all permissions (admin only)
router.get('/', authorize('Permission', 'read'), getPermissions);

// Get permissions for a specific user
router.get('/user/:userId', getUserPermissions);

// Create a permission (admin only)
router.post('/', authorize('Permission', 'create'), createPermission);

// Update a permission (admin only)
router.put('/:id', authorize('Permission', 'update'), updatePermission);

// Delete a permission (admin only)
router.delete('/:id', authorize('Permission', 'delete'), deletePermission);

// Bulk create permissions for a user (admin only)
router.post('/bulk', authorize('Permission', 'create'), bulkCreatePermissions);

module.exports = router;

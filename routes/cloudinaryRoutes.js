const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { deleteFromCloudinary } = require('../controllers/mediaLibraryController');

// @route   DELETE /api/cloudinary/delete
// @desc    Delete an image from Cloudinary (used by hero form and other frontend components)
// @access  Private (Admin only)
router.delete('/delete', protect, deleteFromCloudinary);

module.exports = router;

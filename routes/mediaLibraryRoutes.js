const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const mediaLibraryController = require("../controllers/mediaLibraryController");

// @route   GET /api/media-library
// @desc    Get all Cloudinary images with usage status
// @access  Private (Admin only)
router.get("/", protect, mediaLibraryController.getMediaLibrary);

// @route   DELETE /api/media-library/:publicId
// @desc    Delete an unused image from Cloudinary
// @access  Private (Admin only)
router.delete("/:publicId", protect, mediaLibraryController.deleteUnusedImage);

module.exports = router;

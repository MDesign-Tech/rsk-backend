const TeamMember = require('../models/TeamMember');
const { upload } = require('../middleware/upload');
const { handleImageUpdate, deleteFromCloudinary } = require('../src/utils/cloudinaryUpload');

const getTeamMembers = async (req, res) => {
  const { visible } = req.query;
  const filter = visible !== undefined ? { visible: visible === 'true' } : {};

  const teamMembers = await TeamMember.find(filter);
  return res.status(200).json({
    success: true,
    message: 'Team members retrieved successfully',
    data: { teamMembers },
  });
};

const getTeamMember = async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found',
      errors: ['No team member found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Team member retrieved successfully',
    data: { teamMember },
  });
};

const createTeamMember = async (req, res) => {
  const teamMember = await TeamMember.create(req.body);
  return res.status(201).json({
    success: true,
    message: 'Team member created successfully',
    data: { teamMember },
  });
};

// PUT /team/:id
// Accepts multipart/form-data. Updates text fields and, when an image file is
// present, uploads it to Cloudinary (replacing the previous image) in the same
// atomic request. If no image is sent, only the text fields are updated.
const updateTeamMember = async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found',
      errors: ['No team member found with this ID'],
    });
  }

  try {
    Object.assign(teamMember, req.body);

    await handleImageUpdate(teamMember, req.file, 'rsk/team');

    await teamMember.save();

    return res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      data: { teamMember },
    });
  } catch (error) {
    console.error('Team member update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update team member',
      errors: [error.message || 'Unknown error'],
    });
  }
};

const deleteTeamMember = async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found',
      errors: ['No team member found with this ID'],
    });
  }

  try {
    if (teamMember.imagePublicId) {
      await deleteFromCloudinary(teamMember.imagePublicId);
    }

    await teamMember.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Team member delete error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete team member image from Cloudinary',
      errors: [error.message || 'Unknown error'],
    });
  }
};

const toggleTeamMemberVisibility = async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found',
      errors: ['No team member found with this ID'],
    });
  }

  teamMember.visible = req.body.visible;
  await teamMember.save();

  return res.status(200).json({
    success: true,
    message: 'Team member visibility updated successfully',
    data: { teamMember },
  });
};

module.exports = {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberVisibility,
  upload, // exported for route-level multer wiring
};

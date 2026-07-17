const TeamMember = require('../models/TeamMember');
const { upload } = require('../middleware/upload');
const { uploadToCloudinary, deleteFromCloudinary } = require('../src/utils/cloudinaryUpload');

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

const updateTeamMember = async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found',
      errors: ['No team member found with this ID'],
    });
  }

  Object.assign(teamMember, req.body);
  await teamMember.save();

  return res.status(200).json({
    success: true,
    message: 'Team member updated successfully',
    data: { teamMember },
  });
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

  if (teamMember.imagePublicId) {
    await deleteFromCloudinary(teamMember.imagePublicId);
  }

  await teamMember.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Team member deleted successfully',
    data: {},
  });
};

const uploadTeamMemberImage = async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);

  if (!teamMember) {
    return res.status(404).json({
      success: false,
      message: 'Team member not found',
      errors: ['No team member found with this ID'],
    });
  }

  if (teamMember.imagePublicId) {
    await deleteFromCloudinary(teamMember.imagePublicId);
  }

  const result = await uploadToCloudinary(req.file.buffer, 'rsk/team');

  teamMember.image = result.secure_url;
  teamMember.imagePublicId = result.public_id;
  await teamMember.save();

  return res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: { teamMember },
  });
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
  uploadTeamMemberImage,
  toggleTeamMemberVisibility,
};

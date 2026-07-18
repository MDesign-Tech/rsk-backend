const TeamMember = require('../models/TeamMember');
const TeamSection = require('../models/TeamSection');
const { upload } = require('../middleware/upload');
const { handleImageUpdate, deleteFromCloudinary } = require('../src/utils/cloudinaryUpload');

const getTeamMembers = async (req, res) => {
  const teamMembers = await TeamMember.find()
    .populate('section')
    .sort({ createdAt: 1 });

  const sections = await TeamSection.find().sort({ order: 1 });

  const grouped = sections.map((section) => ({
    section: {
      _id: section._id,
      name: section.name,
      description: section.description,
      order: section.order,
      visible: section.visible,
    },
    members: teamMembers.filter(
      (member) => member.section && member.section._id.toString() === section._id.toString()
    ),
  }));

  return res.status(200).json({
    success: true,
    message: 'Team members retrieved successfully',
    data: { team: grouped },
  });
};

const getPublicTeam = async (req, res) => {
  const sections = await TeamSection.find({ visible: true }).sort({ order: 1 });

  const sectionIds = sections.map((s) => s._id);
  const teamMembers = await TeamMember.find({
    visible: true,
    section: { $in: sectionIds },
  })
    .populate('section')
    .sort({ createdAt: 1 });

  const grouped = sections.map((section) => ({
    section: {
      _id: section._id,
      name: section.name,
      description: section.description,
      order: section.order,
      visible: section.visible,
    },
    members: teamMembers.filter(
      (member) => member.section && member.section._id.toString() === section._id.toString()
    ),
  }));

  return res.status(200).json({
    success: true,
    message: 'Team members retrieved successfully',
    data: { team: grouped },
  });
};

const getTeamMember = async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id).populate('section');

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

// When the request is multipart/form-data, nested objects (e.g. socialMedia)
// arrive as JSON strings. Parse them so they can be assigned to sub-documents.
const parseJsonFields = (body) => {
  if (body && typeof body.socialMedia === 'string') {
    try {
      body.socialMedia = JSON.parse(body.socialMedia);
    } catch (err) {
      // Leave as-is; mongoose will surface a clear validation error if invalid.
    }
  }
  return body;
};

const createTeamMember = async (req, res) => {
  try {
    const teamMember = new TeamMember(parseJsonFields(req.body));

    // Upload image to Cloudinary if one was provided (multipart/form-data).
    await handleImageUpdate(teamMember, req.file, 'rsk/team');

    await teamMember.save();
    await teamMember.populate('section');

    return res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: { teamMember },
    });
  } catch (error) {
    console.error('Team member create error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create team member',
      errors: [error.message || 'Unknown error'],
    });
  }
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

  try {
    Object.assign(teamMember, parseJsonFields(req.body));

    await handleImageUpdate(teamMember, req.file, 'rsk/team');

    await teamMember.save();
    await teamMember.populate('section');

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
  await teamMember.populate('section');

  return res.status(200).json({
    success: true,
    message: 'Team member visibility updated successfully',
    data: { teamMember },
  });
};

module.exports = {
  getTeamMembers,
  getPublicTeam,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberVisibility,
  upload, // exported for route-level multer wiring
};

const TeamSection = require('../models/TeamSection');
const TeamMember = require('../models/TeamMember');

const getTeamSections = async (req, res) => {
  const teamSections = await TeamSection.find().sort({ order: 1 });

  return res.status(200).json({
    success: true,
    message: 'Team sections retrieved successfully',
    data: { teamSections },
  });
};

const getTeamSection = async (req, res) => {
  const teamSection = await TeamSection.findById(req.params.id);

  if (!teamSection) {
    return res.status(404).json({
      success: false,
      message: 'Team section not found',
      errors: ['No team section found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Team section retrieved successfully',
    data: { teamSection },
  });
};

const createTeamSection = async (req, res) => {
  const teamSection = await TeamSection.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Team section created successfully',
    data: { teamSection },
  });
};

const updateTeamSection = async (req, res) => {
  const teamSection = await TeamSection.findById(req.params.id);

  if (!teamSection) {
    return res.status(404).json({
      success: false,
      message: 'Team section not found',
      errors: ['No team section found with this ID'],
    });
  }

  Object.assign(teamSection, req.body);
  await teamSection.save();

  return res.status(200).json({
    success: true,
    message: 'Team section updated successfully',
    data: { teamSection },
  });
};

const deleteTeamSection = async (req, res) => {
  const teamSection = await TeamSection.findById(req.params.id);

  if (!teamSection) {
    return res.status(404).json({
      success: false,
      message: 'Team section not found',
      errors: ['No team section found with this ID'],
    });
  }

  const hasMembers = await TeamMember.exists({ section: teamSection._id });

  if (hasMembers) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete a section that still contains team members.',
      errors: ['Cannot delete a section that still contains team members.'],
    });
  }

  await teamSection.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Team section deleted successfully',
    data: {},
  });
};

const toggleTeamSectionVisibility = async (req, res) => {
  const teamSection = await TeamSection.findById(req.params.id);

  if (!teamSection) {
    return res.status(404).json({
      success: false,
      message: 'Team section not found',
      errors: ['No team section found with this ID'],
    });
  }

  teamSection.visible = req.body.visible;
  await teamSection.save();

  return res.status(200).json({
    success: true,
    message: 'Team section visibility updated successfully',
    data: { teamSection },
  });
};

module.exports = {
  getTeamSections,
  getTeamSection,
  createTeamSection,
  updateTeamSection,
  deleteTeamSection,
  toggleTeamSectionVisibility,
};

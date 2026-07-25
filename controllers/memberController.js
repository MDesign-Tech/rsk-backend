const TeamMember = require('../models/TeamMember');
const User = require('../models/User');

const getMembers = async (req, res) => {
  const members = await TeamMember.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message: 'Members retrieved successfully',
    data: { members },
  });
};

const getMember = async (req, res) => {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
      errors: ['No member found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Member retrieved successfully',
    data: { member },
  });
};

const createMember = async (req, res) => {
  const member = await TeamMember.create(req.body);
  return res.status(201).json({
    success: true,
    message: 'Member created successfully',
    data: { member },
  });
};

const updateMember = async (req, res) => {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
      errors: ['No member found with this ID'],
    });
  }

  Object.assign(member, req.body);
  await member.save();

  return res.status(200).json({
    success: true,
    message: 'Member updated successfully',
    data: { member },
  });
};

const deleteMember = async (req, res) => {
  const member = await TeamMember.findById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
      errors: ['No member found with this ID'],
    });
  }

  // Unlink user if exists - do NOT delete the User
  if (member.user) {
    const user = await User.findById(member.user);
    if (user) {
      user.member = null;
      await user.save();
    }
  }

  await member.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Member deleted successfully',
    data: {},
  });
};

const linkUserToMember = async (req, res) => {
  const { userId } = req.params;
  const { memberId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No user found with this ID'],
    });
  }

  const member = await TeamMember.findById(memberId);
  if (!member) {
    return res.status(404).json({
      success: false,
      message: 'Member not found',
      errors: ['No member found with this ID'],
    });
  }

  // Check if member already has a linked user (and it's not this user)
  if (member.user && member.user.toString() !== userId) {
    return res.status(400).json({
      success: false,
      message: 'Member already linked',
      errors: ['This member already has an associated user account'],
    });
  }

  // Update user's member reference and sync name from member
  user.member = memberId;
  user.name = member.name;
  await user.save();

  // Update member's user reference
  member.user = userId;
  await member.save();

  return res.status(200).json({
    success: true,
    message: 'User linked to member successfully',
    data: { user, member },
  });
};

const unlinkUserFromMember = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No user found with this ID'],
    });
  }

  // Remove user's member reference
  const memberId = user.member;
  user.member = null;
  await user.save();

  // Remove member's user reference if it matches
  if (memberId) {
    await TeamMember.findByIdAndUpdate(memberId, { user: null });
  }

  return res.status(200).json({
    success: true,
    message: 'User unlinked from member successfully',
    data: { user },
  });
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  linkUserToMember,
  unlinkUserFromMember,
};

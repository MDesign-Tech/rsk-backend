const User = require('../models/User');
const TeamMember = require('../models/TeamMember');

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').populate('member', 'name department position');
  return res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: { users },
  });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('member', 'name department position');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No user found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: { user },
  });
};

const getAvailableMembers = async (req, res) => {
  // Get TeamMembers that do NOT have a linked User
  const availableMembers = await TeamMember.find({ user: null })
    .sort({ order: 1, createdAt: 1 });

  return res.status(200).json({
    success: true,
    message: 'Available members retrieved successfully',
    data: { members: availableMembers },
  });
};

const createUser = async (req, res) => {
  const { name, email, phone, password, memberId } = req.body;

  // Password is always required when creating a user
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
      errors: ['Password is required when creating a user'],
    });
  }

  // If memberId is provided, validate and link
  if (memberId) {
    const member = await TeamMember.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
        errors: ['No member found with this ID'],
      });
    }

    // Check if member already has a linked user
    if (member.user) {
      return res.status(400).json({
        success: false,
        message: 'Member already linked',
        errors: ['This member already has an associated user account'],
      });
    }

    // Auto-copy name from member
    const userName = member.name;

    // Create user with member linked, role auto-set to 'member'
    const user = await User.create({
      name: userName,
      email,
      phone,
      password,
      role: 'member',
      member: memberId,
    });

    // Link member to user
    member.user = user._id;
    await member.save();

    const populatedUser = await User.findById(user._id)
      .select('-password')
      .populate('member', 'name department position');

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: populatedUser },
    });
  }

  // Without memberId - require name, email, password
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      errors: ['Name and email are required when not linking to a member'],
    });
  }

  // Create user without member, role auto-set to 'member'
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'member',
    member: null,
  });

  const populatedUser = await User.findById(user._id)
    .select('-password')
    .populate('member', 'name department position');

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user: populatedUser },
  });
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No user found with this ID'],
    });
  }

  const { name, email, phone, password, memberId } = req.body;

  // If memberId is being changed
  if (memberId !== undefined) {
    // If setting a new member
    if (memberId) {
      const member = await TeamMember.findById(memberId);
      if (!member) {
        return res.status(404).json({
          success: false,
          message: 'Member not found',
          errors: ['No member found with this ID'],
        });
      }

      // Check if member already has a linked user (and it's not this user)
      if (member.user && member.user.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Member already linked',
          errors: ['This member already has an associated user account'],
        });
      }

      // Unlink old member if exists
      if (user.member) {
        const oldMember = await TeamMember.findById(user.member);
        if (oldMember) {
          oldMember.user = null;
          await oldMember.save();
        }
      }

      // Link new member and sync name from member to user
      user.member = memberId;
      user.name = member.name;
      member.user = user._id;
      await member.save();
    } else {
      // Unlink current member
      if (user.member) {
        const currentMember = await TeamMember.findById(user.member);
        if (currentMember) {
          currentMember.user = null;
          await currentMember.save();
        }
        user.member = null;
      }
    }
  }

  // Update other fields
  if (name !== undefined) {
    user.name = name;
    // Sync name to linked member if exists
    if (user.member) {
      const linkedMember = await TeamMember.findById(user.member);
      if (linkedMember) {
        linkedMember.name = name;
        await linkedMember.save();
      }
    }
  }
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (password) user.password = password;

  // Prevent role changes through normal update
  // Only allow role change if explicitly passed (for admin linking)
  if (req.body.role) {
    user.role = req.body.role;
  }

  await user.save();

  const populatedUser = await User.findById(user._id)
    .select('-password')
    .populate('member', 'name department position');

  return res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user: populatedUser },
  });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      errors: ['No user found with this ID'],
    });
  }

  // Unlink member if exists - do NOT delete the TeamMember
  if (user.member) {
    const member = await TeamMember.findById(user.member);
    if (member) {
      member.user = null;
      await member.save();
    }
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: {},
  });
};

module.exports = {
  getUsers,
  getUser,
  getAvailableMembers,
  createUser,
  updateUser,
  deleteUser,
};

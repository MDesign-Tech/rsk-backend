const Permission = require('../models/Permission');
const Module = require('../models/Module');
const User = require('../models/User');

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private (Admin)
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find()
      .populate('user', 'name email role')
      .populate('module', 'name description icon')
      .sort({ module: 1, user: 1 });

    return res.status(200).json({
      success: true,
      message: 'Permissions retrieved successfully',
      data: { permissions },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve permissions',
      errors: [error.message],
    });
  }
};

// @desc    Get permissions for a specific user
// @route   GET /api/permissions/user/:userId
// @access  Private (Admin or own user)
const getUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can view their own permissions; admins can view any
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: ['You can only view your own permissions'],
      });
    }

    const permissions = await Permission.find({ user: userId })
      .populate('module', 'name description icon')
      .sort({ module: 1 });

    return res.status(200).json({
      success: true,
      message: 'User permissions retrieved successfully',
      data: { permissions },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user permissions',
      errors: [error.message],
    });
  }
};

// @desc    Create a permission
// @route   POST /api/permissions
// @access  Private (Admin)
const createPermission = async (req, res) => {
  try {
    const { user, module, canCreate, canRead, canUpdate, canDelete } = req.body;

    // Verify user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['No user found with this ID'],
      });
    }

    // Verify module exists
    const moduleDoc = await Module.findById(module);
    if (!moduleDoc) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
        errors: ['No module found with this ID'],
      });
    }

    const permission = await Permission.create({
      user,
      module,
      canCreate: canCreate ?? false,
      canRead: canRead ?? false,
      canUpdate: canUpdate ?? false,
      canDelete: canDelete ?? false,
    });

    const populatedPermission = await Permission.findById(permission._id)
      .populate('user', 'name email role')
      .populate('module', 'name description icon');

    return res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: { permission: populatedPermission },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Permission already exists',
        errors: ['This user already has a permission for this module'],
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create permission',
      errors: [error.message],
    });
  }
};

// @desc    Update a permission
// @route   PUT /api/permissions/:id
// @access  Private (Admin)
const updatePermission = async (req, res) => {
  try {
    const { canCreate, canRead, canUpdate, canDelete } = req.body;

    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found',
        errors: ['No permission found with this ID'],
      });
    }

    if (canCreate !== undefined) permission.canCreate = canCreate;
    if (canRead !== undefined) permission.canRead = canRead;
    if (canUpdate !== undefined) permission.canUpdate = canUpdate;
    if (canDelete !== undefined) permission.canDelete = canDelete;

    await permission.save();

    const updatedPermission = await Permission.findById(permission._id)
      .populate('user', 'name email role')
      .populate('module', 'name description icon');

    return res.status(200).json({
      success: true,
      message: 'Permission updated successfully',
      data: { permission: updatedPermission },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update permission',
      errors: [error.message],
    });
  }
};

// @desc    Delete a permission
// @route   DELETE /api/permissions/:id
// @access  Private (Admin)
const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found',
        errors: ['No permission found with this ID'],
      });
    }

    await permission.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Permission deleted successfully',
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete permission',
      errors: [error.message],
    });
  }
};

// @desc    Bulk create permissions for a user
// @route   POST /api/permissions/bulk
// @access  Private (Admin)
const bulkCreatePermissions = async (req, res) => {
  try {
    const { userId, permissions } = req.body;

    // Verify user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['No user found with this ID'],
      });
    }

    // Verify all modules exist
    const moduleIds = permissions.map(p => p.module);
    const modules = await Module.find({ _id: { $in: moduleIds } });
    if (modules.length !== moduleIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more modules not found',
        errors: ['Invalid module ID in permissions list'],
      });
    }

    // Delete existing permissions for this user and recreate
    await Permission.deleteMany({ user: userId });

    const createdPermissions = [];
    for (const perm of permissions) {
      const created = await Permission.create({
        user: userId,
        module: perm.module,
        canCreate: perm.canCreate ?? false,
        canRead: perm.canRead ?? false,
        canUpdate: perm.canUpdate ?? false,
        canDelete: perm.canDelete ?? false,
      });
      createdPermissions.push(created);
    }

    const populatedPermissions = await Permission.find({ user: userId })
      .populate('user', 'name email role')
      .populate('module', 'name description icon')
      .sort({ module: 1 });

    return res.status(201).json({
      success: true,
      message: 'Permissions created successfully',
      data: { permissions: populatedPermissions },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create permissions',
      errors: [error.message],
    });
  }
};

// @desc    Get permissions for a user by email
// @route   GET /api/permissions/user-by-email/:email
// @access  Private (Admin)
const getUserPermissionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Only admin can view permissions by email
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        errors: ["Only administrators can view user permissions"],
      });
    }

    const user = await User.findOne({ email }).select("_id name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: ["No user found with this email address"],
      });
    }

    const permissions = await Permission.find({ user: user._id })
      .populate("module", "name description icon")
      .sort({ module: 1 });

    return res.status(200).json({
      success: true,
      message: "User permissions retrieved successfully",
      data: { user, permissions },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user permissions",
      errors: [error.message],
    });
  }
};

module.exports = {
  getPermissions,
  getUserPermissions,
  getUserPermissionsByEmail,
  createPermission,
  updatePermission,
  deletePermission,
  bulkCreatePermissions,
};

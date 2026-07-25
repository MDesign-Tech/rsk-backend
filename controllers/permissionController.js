const Permission = require('../models/Permission');
const Module = require('../models/Module');
const User = require('../models/User');

const getPermissions = async (req, res) => {
  const permissions = await Permission.find()
    .populate('user', 'name email role')
    .populate('module', 'name route icon')
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: 'Permissions retrieved successfully',
    data: { permissions },
  });
};

const getUserPermissions = async (req, res) => {
  const { userId } = req.params;

  if (!userId || userId === 'undefined' || userId === 'null') {
    return res.status(200).json({
      success: true,
      message: 'User permissions retrieved successfully',
      data: { permissions: [] },
    });
  }

  const permissions = await Permission.find({ user: userId })
    .populate('module', 'name route icon')
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: 'User permissions retrieved successfully',
    data: { permissions },
  });
};

const createPermission = async (req, res) => {
  const { user, module, canCreate, canRead, canUpdate, canDelete } = req.body;

  // Check if permission already exists
  const existing = await Permission.findOne({ user, module });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Permission already exists for this user and module',
      errors: ['A permission record for this user and module already exists'],
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

  await permission.populate('user', 'name email role');
  await permission.populate('module', 'name route icon');

  return res.status(201).json({
    success: true,
    message: 'Permission created successfully',
    data: { permission },
  });
};

const updatePermission = async (req, res) => {
  const permission = await Permission.findById(req.params.id);

  if (!permission) {
    return res.status(404).json({
      success: false,
      message: 'Permission not found',
      errors: ['No permission found with this ID'],
    });
  }

  const { canCreate, canRead, canUpdate, canDelete } = req.body;

  if (canCreate !== undefined) permission.canCreate = canCreate;
  if (canRead !== undefined) permission.canRead = canRead;
  if (canUpdate !== undefined) permission.canUpdate = canUpdate;
  if (canDelete !== undefined) permission.canDelete = canDelete;

  await permission.save();
  await permission.populate('user', 'name email role');
  await permission.populate('module', 'name route icon');

  return res.status(200).json({
    success: true,
    message: 'Permission updated successfully',
    data: { permission },
  });
};

const deletePermission = async (req, res) => {
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
};

const bulkCreatePermissions = async (req, res) => {
  const { userId, permissions } = req.body;

  if (!userId || !Array.isArray(permissions)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request',
      errors: ['userId and permissions array are required'],
    });
  }

  // Delete existing permissions for this user
  await Permission.deleteMany({ user: userId });

  // Create new permissions
  const createdPermissions = [];
  for (const perm of permissions) {
    const permission = await Permission.create({
      user: userId,
      module: perm.module,
      canCreate: perm.canCreate ?? false,
      canRead: perm.canRead ?? false,
      canUpdate: perm.canUpdate ?? false,
      canDelete: perm.canDelete ?? false,
    });
    await permission.populate('module', 'name route icon');
    createdPermissions.push(permission);
  }

  return res.status(201).json({
    success: true,
    message: 'Permissions created successfully',
    data: { permissions: createdPermissions },
  });
};

module.exports = {
  getPermissions,
  getUserPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  bulkCreatePermissions,
};

const Module = require('../models/Module');

// @desc    Get all modules
// @route   GET /api/modules
// @access  Private (Admin)
const getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1, name: 1 });

    return res.status(200).json({
      success: true,
      message: 'Modules retrieved successfully',
      data: { modules },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve modules',
      errors: [error.message],
    });
  }
};

// @desc    Get a single module
// @route   GET /api/modules/:id
// @access  Private (Admin)
const getModule = async (req, res) => {
  try {
    const moduleDoc = await Module.findById(req.params.id);

    if (!moduleDoc) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
        errors: ['No module found with this ID'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Module retrieved successfully',
      data: { module: moduleDoc },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve module',
      errors: [error.message],
    });
  }
};

// @desc    Create a module
// @route   POST /api/modules
// @access  Private (Admin)
const createModule = async (req, res) => {
  try {
    const { name, description, route, icon, order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Module name is required',
        errors: ['Module name is required'],
      });
    }

    const moduleDoc = await Module.create({
      name,
      description,
      route,
      icon,
      order: order || 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: { module: moduleDoc },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Module already exists',
        errors: ['A module with this name already exists'],
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create module',
      errors: [error.message],
    });
  }
};

// @desc    Update a module
// @route   PUT /api/modules/:id
// @access  Private (Admin)
const updateModule = async (req, res) => {
  try {
    const { name, description, route, icon, order, isActive } = req.body;

    const moduleDoc = await Module.findById(req.params.id);

    if (!moduleDoc) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
        errors: ['No module found with this ID'],
      });
    }

    if (name !== undefined) moduleDoc.name = name;
    if (description !== undefined) moduleDoc.description = description;
    if (route !== undefined) moduleDoc.route = route;
    if (icon !== undefined) moduleDoc.icon = icon;
    if (order !== undefined) moduleDoc.order = order;
    if (isActive !== undefined) moduleDoc.isActive = isActive;

    await moduleDoc.save();

    return res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: { module: moduleDoc },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update module',
      errors: [error.message],
    });
  }
};

// @desc    Delete a module
// @route   DELETE /api/modules/:id
// @access  Private (Admin)
const deleteModule = async (req, res) => {
  try {
    const moduleDoc = await Module.findById(req.params.id);

    if (!moduleDoc) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
        errors: ['No module found with this ID'],
      });
    }

    await moduleDoc.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Module deleted successfully',
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete module',
      errors: [error.message],
    });
  }
};

module.exports = {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
};

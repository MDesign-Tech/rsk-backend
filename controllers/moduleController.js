const Module = require('../models/Module');

const getModules = async (req, res) => {
  const modules = await Module.find().sort({ order: 1, createdAt: 1 });
  return res.status(200).json({
    success: true,
    message: 'Modules retrieved successfully',
    data: { modules },
  });
};

const getModule = async (req, res) => {
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
};

const createModule = async (req, res) => {
  const moduleDoc = await Module.create(req.body);
  return res.status(201).json({
    success: true,
    message: 'Module created successfully',
    data: { module: moduleDoc },
  });
};

const updateModule = async (req, res) => {
  const moduleDoc = await Module.findById(req.params.id);

  if (!moduleDoc) {
    return res.status(404).json({
      success: false,
      message: 'Module not found',
      errors: ['No module found with this ID'],
    });
  }

  Object.assign(moduleDoc, req.body);
  await moduleDoc.save();

  return res.status(200).json({
    success: true,
    message: 'Module updated successfully',
    data: { module: moduleDoc },
  });
};

const deleteModule = async (req, res) => {
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
};

module.exports = {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
};

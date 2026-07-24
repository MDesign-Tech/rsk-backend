const Category = require('../models/Category');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  return res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    data: { categories },
  });
};

const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
      errors: ['No category found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Category retrieved successfully',
    data: { category },
  });
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create category',
      errors: [error.message || 'Unknown error'],
    });
  }
};

const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
      errors: ['No category found with this ID'],
    });
  }

  try {
    Object.assign(category, req.body);
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update category',
      errors: [error.message || 'Unknown error'],
    });
  }
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
      errors: ['No category found with this ID'],
    });
  }

  try {
    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      errors: [error.message || 'Unknown error'],
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

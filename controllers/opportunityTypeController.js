const OpportunityType = require('../models/OpportunityType');

const getOpportunityTypes = async (req, res) => {
  const types = await OpportunityType.find().sort({ name: 1 });

  return res.status(200).json({
    success: true,
    message: 'Opportunity types retrieved successfully',
    data: { types },
  });
};

const getOpportunityType = async (req, res) => {
  const opportunityType = await OpportunityType.findById(req.params.id);

  if (!opportunityType) {
    return res.status(404).json({
      success: false,
      message: 'Opportunity type not found',
      errors: ['No opportunity type found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Opportunity type retrieved successfully',
    data: { opportunityType },
  });
};

const createOpportunityType = async (req, res) => {
  try {
    const opportunityType = await OpportunityType.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Opportunity type created successfully',
      data: { opportunityType },
    });
  } catch (error) {
    console.error('Create opportunity type error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create opportunity type',
      errors: [error.message || 'Unknown error'],
    });
  }
};

const updateOpportunityType = async (req, res) => {
  const opportunityType = await OpportunityType.findById(req.params.id);

  if (!opportunityType) {
    return res.status(404).json({
      success: false,
      message: 'Opportunity type not found',
      errors: ['No opportunity type found with this ID'],
    });
  }

  try {
    Object.assign(opportunityType, req.body);
    await opportunityType.save();

    return res.status(200).json({
      success: true,
      message: 'Opportunity type updated successfully',
      data: { opportunityType },
    });
  } catch (error) {
    console.error('Update opportunity type error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update opportunity type',
      errors: [error.message || 'Unknown error'],
    });
  }
};

const deleteOpportunityType = async (req, res) => {
  const opportunityType = await OpportunityType.findById(req.params.id);

  if (!opportunityType) {
    return res.status(404).json({
      success: false,
      message: 'Opportunity type not found',
      errors: ['No opportunity type found with this ID'],
    });
  }

  try {
    await opportunityType.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Opportunity type deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete opportunity type error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete opportunity type',
      errors: [error.message || 'Unknown error'],
    });
  }
};

module.exports = {
  getOpportunityTypes,
  getOpportunityType,
  createOpportunityType,
  updateOpportunityType,
  deleteOpportunityType,
};

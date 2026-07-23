const WhyBecomeMember = require('../models/WhyBecomeMember');

const getWhyBecomeMember = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Why Become Member content retrieved successfully',
    data: { whyBecomeMember },
  });
};

const createWhyBecomeMember = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Why Become Member content created successfully',
    data: { whyBecomeMember },
  });
};

const updateWhyBecomeMember = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  Object.assign(whyBecomeMember, req.body);
  await whyBecomeMember.save();

  return res.status(200).json({
    success: true,
    message: 'Why Become Member content updated successfully',
    data: { whyBecomeMember },
  });
};

const deleteWhyBecomeMember = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  await whyBecomeMember.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Why Become Member content deleted successfully',
    data: {},
  });
};

const toggleWhyBecomeMemberVisibility = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  whyBecomeMember.visible = req.body.visible;
  await whyBecomeMember.save();

  return res.status(200).json({
    success: true,
    message: 'Why Become Member visibility updated successfully',
    data: { whyBecomeMember },
  });
};

// Point CRUD operations
const getPoints = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Points retrieved successfully',
    data: { points: whyBecomeMember.points || [] },
  });
};

const createPoint = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  const newPoint = {
    _id: new Date().getTime().toString(),
    ...req.body,
  };

  whyBecomeMember.points = [...(whyBecomeMember.points || []), newPoint];
  await whyBecomeMember.save();

  return res.status(201).json({
    success: true,
    message: 'Point created successfully',
    data: { point: newPoint },
  });
};

const updatePoint = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  const pointIndex = whyBecomeMember.points.findIndex((p) => p._id === req.params.id);

  if (pointIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Point not found',
      errors: ['No point found with this ID'],
    });
  }

  whyBecomeMember.points[pointIndex] = {
    ...whyBecomeMember.points[pointIndex],
    ...req.body,
    _id: whyBecomeMember.points[pointIndex]._id,
  };

  await whyBecomeMember.save();

  return res.status(200).json({
    success: true,
    message: 'Point updated successfully',
    data: { point: whyBecomeMember.points[pointIndex] },
  });
};

const deletePoint = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  const pointIndex = whyBecomeMember.points.findIndex((p) => p._id === req.params.id);

  if (pointIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Point not found',
      errors: ['No point found with this ID'],
    });
  }

  whyBecomeMember.points.splice(pointIndex, 1);
  await whyBecomeMember.save();

  return res.status(200).json({
    success: true,
    message: 'Point deleted successfully',
    data: {},
  });
};

const togglePointVisibility = async (req, res) => {
  const whyBecomeMember = await WhyBecomeMember.findOne();

  if (!whyBecomeMember) {
    return res.status(404).json({
      success: false,
      message: 'Why Become Member content not found',
      errors: ['No Why Become Member content available'],
    });
  }

  const pointIndex = whyBecomeMember.points.findIndex((p) => p._id === req.params.id);

  if (pointIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Point not found',
      errors: ['No point found with this ID'],
    });
  }

  whyBecomeMember.points[pointIndex].visible = req.body.visible;
  await whyBecomeMember.save();

  return res.status(200).json({
    success: true,
    message: 'Point visibility updated successfully',
    data: { point: whyBecomeMember.points[pointIndex] },
  });
};

module.exports = {
  getWhyBecomeMember,
  createWhyBecomeMember,
  updateWhyBecomeMember,
  deleteWhyBecomeMember,
  toggleWhyBecomeMemberVisibility,
  getPoints,
  createPoint,
  updatePoint,
  deletePoint,
  togglePointVisibility,
};

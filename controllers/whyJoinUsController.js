const WhyJoinUs = require('../models/WhyJoinUs');

const getWhyJoinUs = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Why Join Us content retrieved successfully',
    data: { whyJoinUs },
  });
};

const createWhyJoinUs = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Why Join Us content created successfully',
    data: { whyJoinUs },
  });
};

const updateWhyJoinUs = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  Object.assign(whyJoinUs, req.body);
  await whyJoinUs.save();

  return res.status(200).json({
    success: true,
    message: 'Why Join Us content updated successfully',
    data: { whyJoinUs },
  });
};

const deleteWhyJoinUs = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  await whyJoinUs.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Why Join Us content deleted successfully',
    data: {},
  });
};

const toggleWhyJoinUsVisibility = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  whyJoinUs.visible = req.body.visible;
  await whyJoinUs.save();

  return res.status(200).json({
    success: true,
    message: 'Why Join Us visibility updated successfully',
    data: { whyJoinUs },
  });
};

// Point CRUD operations
const getPoints = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Points retrieved successfully',
    data: { points: whyJoinUs.points || [] },
  });
};

const createPoint = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  const newPoint = {
    _id: new Date().getTime().toString(),
    ...req.body,
  };

  whyJoinUs.points = [...(whyJoinUs.points || []), newPoint];
  await whyJoinUs.save();

  return res.status(201).json({
    success: true,
    message: 'Point created successfully',
    data: { point: newPoint },
  });
};

const updatePoint = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  const pointIndex = whyJoinUs.points.findIndex((p) => p._id === req.params.id);

  if (pointIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Point not found',
      errors: ['No point found with this ID'],
    });
  }

  whyJoinUs.points[pointIndex] = {
    ...whyJoinUs.points[pointIndex],
    ...req.body,
    _id: whyJoinUs.points[pointIndex]._id,
  };

  await whyJoinUs.save();

  return res.status(200).json({
    success: true,
    message: 'Point updated successfully',
    data: { point: whyJoinUs.points[pointIndex] },
  });
};

const deletePoint = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  const pointIndex = whyJoinUs.points.findIndex((p) => p._id === req.params.id);

  if (pointIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Point not found',
      errors: ['No point found with this ID'],
    });
  }

  whyJoinUs.points.splice(pointIndex, 1);
  await whyJoinUs.save();

  return res.status(200).json({
    success: true,
    message: 'Point deleted successfully',
    data: {},
  });
};

const togglePointVisibility = async (req, res) => {
  const whyJoinUs = await WhyJoinUs.findOne();

  if (!whyJoinUs) {
    return res.status(404).json({
      success: false,
      message: 'Why Join Us content not found',
      errors: ['No Why Join Us content available'],
    });
  }

  const pointIndex = whyJoinUs.points.findIndex((p) => p._id === req.params.id);

  if (pointIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Point not found',
      errors: ['No point found with this ID'],
    });
  }

  whyJoinUs.points[pointIndex].visible = req.body.visible;
  await whyJoinUs.save();

  return res.status(200).json({
    success: true,
    message: 'Point visibility updated successfully',
    data: { point: whyJoinUs.points[pointIndex] },
  });
};

module.exports = {
  getWhyJoinUs,
  createWhyJoinUs,
  updateWhyJoinUs,
  deleteWhyJoinUs,
  toggleWhyJoinUsVisibility,
  getPoints,
  createPoint,
  updatePoint,
  deletePoint,
  togglePointVisibility,
};

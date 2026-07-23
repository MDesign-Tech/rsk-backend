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

module.exports = {
  getWhyJoinUs,
  createWhyJoinUs,
  updateWhyJoinUs,
  deleteWhyJoinUs,
  toggleWhyJoinUsVisibility,
};

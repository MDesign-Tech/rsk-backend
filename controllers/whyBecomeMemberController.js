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

module.exports = {
  getWhyBecomeMember,
  createWhyBecomeMember,
  updateWhyBecomeMember,
  deleteWhyBecomeMember,
  toggleWhyBecomeMemberVisibility,
};

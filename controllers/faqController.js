const FAQ = require('../models/FAQ');

const getFAQs = async (req, res) => {
  const faqs = await FAQ.find();

  return res.status(200).json({
    success: true,
    message: "FAQs retrieved successfully",
    data: { faqs },
  });
};

const getFAQ = async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    return res.status(404).json({
      success: false,
      message: 'FAQ not found',
      errors: ['No FAQ found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'FAQ retrieved successfully',
    data: { faq },
  });
};

const createFAQ = async (req, res) => {
  const faq = await FAQ.create(req.body);
  return res.status(201).json({
    success: true,
    message: 'FAQ created successfully',
    data: { faq },
  });
};

const updateFAQ = async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    return res.status(404).json({
      success: false,
      message: 'FAQ not found',
      errors: ['No FAQ found with this ID'],
    });
  }

  Object.assign(faq, req.body);
  await faq.save();

  return res.status(200).json({
    success: true,
    message: 'FAQ updated successfully',
    data: { faq },
  });
};

const deleteFAQ = async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    return res.status(404).json({
      success: false,
      message: 'FAQ not found',
      errors: ['No FAQ found with this ID'],
    });
  }

  await faq.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'FAQ deleted successfully',
    data: {},
  });
};

module.exports = {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};

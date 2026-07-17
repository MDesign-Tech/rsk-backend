const Partner = require('../models/Partner');
const { upload } = require('../middleware/upload');
const { uploadToCloudinary, deleteFromCloudinary } = require('../src/utils/cloudinaryUpload');


const getPartners = async (req, res) => {
  const { visible } = req.query;
  const filter = visible !== undefined ? { visible: visible === 'true' } : {};

  const partners = await Partner.find(filter);

  return res.status(200).json({
    success: true,
    message: 'Partners retrieved successfully',
    data: { partners },
  });
};


const getPartner = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return res.status(404).json({
      success: false,
      message: 'Partner not found',
      errors: ['No partner found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Partner retrieved successfully',
    data: { partner },
  });
};


const createPartner = async (req, res) => {
  const partner = await Partner.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Partner created successfully',
    data: { partner },
  });
};


const updatePartner = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return res.status(404).json({
      success: false,
      message: 'Partner not found',
      errors: ['No partner found with this ID'],
    });
  }

  Object.assign(partner, req.body);
  await partner.save();

  return res.status(200).json({
    success: true,
    message: 'Partner updated successfully',
    data: { partner },
  });
};


const deletePartner = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return res.status(404).json({
      success: false,
      message: 'Partner not found',
      errors: ['No partner found with this ID'],
    });
  }

  if (partner.imagePublicId) {
    await deleteFromCloudinary(partner.imagePublicId);
  }

  await partner.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Partner deleted successfully',
    data: {},
  });
};


const uploadPartnerImage = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return res.status(404).json({
      success: false,
      message: 'Partner not found',
      errors: ['No partner found with this ID'],
    });
  }

  if (partner.imagePublicId) {
    await deleteFromCloudinary(partner.imagePublicId);
  }

  const result = await uploadToCloudinary(req.file.buffer, 'rsk/partners');

  partner.image = result.secure_url;
  partner.imagePublicId = result.public_id;
  await partner.save();

  return res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: { partner },
  });
};


const togglePartnerVisibility = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return res.status(404).json({
      success: false,
      message: 'Partner not found',
      errors: ['No partner found with this ID'],
    });
  }

  partner.visible = req.body.visible;
  await partner.save();

  return res.status(200).json({
    success: true,
    message: 'Partner visibility updated successfully',
    data: { partner },
  });
};

module.exports = {
  getPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  uploadPartnerImage,
  togglePartnerVisibility,
};

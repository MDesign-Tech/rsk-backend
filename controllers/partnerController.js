const Partner = require('../models/Partner');
const { upload } = require('../middleware/upload');
const { handleImageUpdate, deleteFromCloudinary } = require('../src/utils/cloudinaryUpload');


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


// PUT /partners/:id
// Accepts multipart/form-data. Updates text fields and, when an image file is
// present, uploads it to Cloudinary (replacing the previous image) in the same
// atomic request. If no image is sent, only the text fields are updated.
const updatePartner = async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return res.status(404).json({
      success: false,
      message: 'Partner not found',
      errors: ['No partner found with this ID'],
    });
  }

  try {
    Object.assign(partner, req.body);

    await handleImageUpdate(partner, req.file, 'rsk/partners');

    await partner.save();

    return res.status(200).json({
      success: true,
      message: 'Partner updated successfully',
      data: { partner },
    });
  } catch (error) {
    console.error('Partner update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update partner',
      errors: [error.message || 'Unknown error'],
    });
  }
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

  try {
    if (partner.imagePublicId) {
      await deleteFromCloudinary(partner.imagePublicId);
    }

    await partner.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Partner deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Partner delete error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete partner image from Cloudinary',
      errors: [error.message || 'Unknown error'],
    });
  }
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
  togglePartnerVisibility,
  upload, // exported for route-level multer wiring
};

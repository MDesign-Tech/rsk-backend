const Service = require('../models/Service');


const getServices = async (req, res) => {
  const { visible } = req.query;
  const filter = visible !== undefined ? { visible: visible === 'true' } : {};

  const services = await Service.find(filter);

  return res.status(200).json({
    success: true,
    message: 'Services retrieved successfully',
    data: { services },
  });
};


const getService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
      errors: ['No service found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Service retrieved successfully',
    data: { service },
  });
};


const createService = async (req, res) => {
  const service = await Service.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: { service },
  });
};


const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
      errors: ['No service found with this ID'],
    });
  }

  Object.assign(service, req.body);
  await service.save();

  return res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    data: { service },
  });
};


const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
      errors: ['No service found with this ID'],
    });
  }

  await service.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
    data: {},
  });
};


const toggleServiceVisibility = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
      errors: ['No service found with this ID'],
    });
  }

  service.visible = req.body.visible;
  await service.save();

  return res.status(200).json({
    success: true,
    message: 'Service visibility updated successfully',
    data: { service },
  });
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceVisibility,
};

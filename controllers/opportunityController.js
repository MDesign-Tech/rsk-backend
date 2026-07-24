const Opportunity = require('../models/Opportunity');
const OpportunityType = require('../models/OpportunityType');

// Build a mongoose filter + sort from the shared list query params.
const buildListQuery = (query, { forceVisible = false } = {}) => {
  const filter = {};

  if (forceVisible) {
    filter.visible = true;
  } else if (query.visible !== undefined && query.visible !== '') {
    filter.visible = query.visible === 'true' || query.visible === true;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { org: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  // Sort: support "-field" for descending, default to -date.
  let sort = { date: -1 };
  if (query.sort) {
    const field = query.sort.replace(/^-/, '');
    const direction = query.sort.startsWith('-') ? -1 : 1;
    sort = { [field]: direction };
  }

  return { filter, sort };
};

// GET /api/opportunities  (admin list)
const listOpportunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { filter, sort } = buildListQuery(req.query);

    const skip = (page - 1) * limit;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter)
        .populate('type')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Opportunity.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: 'Opportunities retrieved successfully',
      data: {
        opportunities,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List opportunities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunities',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// GET /api/opportunities/public  (public list, visible only)
const listPublicOpportunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { filter, sort } = buildListQuery(req.query, { forceVisible: true });

    const skip = (page - 1) * limit;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter)
        .populate('type')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Opportunity.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: 'Opportunities retrieved successfully',
      data: {
        opportunities,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List public opportunities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunities',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// GET /api/opportunities/:id  (admin)
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('type');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
        errors: ['No opportunity found with this ID'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Opportunity retrieved successfully',
      data: { opportunity },
    });
  } catch (error) {
    console.error('Get opportunity by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunity',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// GET /api/opportunities/slug/:slug  (public)
const getOpportunityBySlug = async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({
      slug: req.params.slug,
      visible: true,
    }).populate('type');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
        errors: ['No opportunity found with this slug'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Opportunity retrieved successfully',
      data: { opportunity },
    });
  } catch (error) {
    console.error('Get opportunity by slug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunity',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// GET /api/opportunities/category/:category  (public)
const getOpportunitiesByCategory = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      category: req.params.category,
      visible: true,
    })
      .populate('type')
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: 'Opportunities retrieved successfully',
      data: { opportunities },
    });
  } catch (error) {
    console.error('Get opportunities by category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunities',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// GET /api/opportunities/type/:typeId  (public)
const getOpportunitiesByType = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      type: req.params.typeId,
      visible: true,
    })
      .populate('type')
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: 'Opportunities retrieved successfully',
      data: { opportunities },
    });
  } catch (error) {
    console.error('Get opportunities by type error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunities',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// GET /api/opportunities/types  (public - list all opportunity types)
const getOpportunityTypes = async (req, res) => {
  try {
    const types = await OpportunityType.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: 'Opportunity types retrieved successfully',
      data: { types },
    });
  } catch (error) {
    console.error('Get opportunity types error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunity types',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// POST /api/opportunities  (create)
const createOpportunity = async (req, res) => {
  try {
    const { title, type, org, description, category, location, date, image, imagePublicId, status, visible } = req.body;

    const baseSlug = Opportunity.generateSlug(title);
    const slug = await Opportunity.generateUniqueSlug(baseSlug);

    const opportunity = new Opportunity({
      title,
      slug,
      type,
      org,
      description: description || '',
      category: category || 'General',
      location: location || '',
      date: new Date(date),
      image: image || null,
      imagePublicId: imagePublicId || null,
      status: status || 'Open',
      visible: visible !== undefined ? visible : true,
      publishedAt: new Date(),
    });

    await opportunity.save();
    await opportunity.populate('type');

    return res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: { opportunity },
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create opportunity',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// PUT /api/opportunities/:id  (update, partial)
const updateOpportunity = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: 'Opportunity not found',
      errors: ['No opportunity found with this ID'],
    });
  }

  try {
    const { title, type, org, description, category, location, date, image, imagePublicId, status, visible } = req.body;

    if (title !== undefined) opportunity.title = title;
    if (type !== undefined) opportunity.type = type;
    if (org !== undefined) opportunity.org = org;
    if (description !== undefined) opportunity.description = description;
    if (category !== undefined) opportunity.category = category;
    if (location !== undefined) opportunity.location = location;
    if (image !== undefined) opportunity.image = image;
    if (imagePublicId !== undefined) opportunity.imagePublicId = imagePublicId;
    if (status !== undefined) opportunity.status = status;
    if (visible !== undefined) opportunity.visible = visible;

    if (date !== undefined) {
      opportunity.date = new Date(date);
    }

    if (title !== undefined) {
      const baseSlug = Opportunity.generateSlug(title);
      opportunity.slug = await Opportunity.generateUniqueSlug(baseSlug, opportunity._id);
    }

    await opportunity.save();
    await opportunity.populate('type');

    return res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully',
      data: { opportunity },
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update opportunity',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// DELETE /api/opportunities/type/:typeId  (delete all opportunities of a type)
const deleteOpportunitiesByType = async (req, res) => {
  try {
    const result = await Opportunity.deleteMany({ type: req.params.typeId });

    return res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} opportunities`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error('Delete opportunities by type error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete opportunities by type',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// DELETE /api/opportunities/:id
const deleteOpportunity = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: 'Opportunity not found',
      errors: ['No opportunity found with this ID'],
    });
  }

  try {
    await opportunity.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete opportunity',
      errors: [error.message || 'Unknown error'],
    });
  }
};

// PATCH /api/opportunities/:id/status
const toggleOpportunityStatus = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: 'Opportunity not found',
      errors: ['No opportunity found with this ID'],
    });
  }

  const { status } = req.body;
  opportunity.status = status;

  await opportunity.save();
  await opportunity.populate('type');

  return res.status(200).json({
    success: true,
    message: 'Opportunity status updated successfully',
    data: { opportunity },
  });
};

// PATCH /api/opportunities/:id/visibility
const toggleOpportunityVisibility = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: 'Opportunity not found',
      errors: ['No opportunity found with this ID'],
    });
  }

  opportunity.visible = req.body.visible;
  await opportunity.save();
  await opportunity.populate('type');

  return res.status(200).json({
    success: true,
    message: 'Opportunity visibility updated successfully',
    data: { opportunity },
  });
};

module.exports = {
  listOpportunities,
  listPublicOpportunities,
  getOpportunityById,
  getOpportunityBySlug,
  getOpportunitiesByCategory,
  getOpportunitiesByType,
  getOpportunityTypes,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  deleteOpportunitiesByType,
  toggleOpportunityStatus,
  toggleOpportunityVisibility,
};

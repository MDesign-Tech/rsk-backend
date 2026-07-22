const Opportunity = require('../models/Opportunity');
const { handleImageUpdate, deleteFromCloudinary } = require('../src/utils/cloudinaryUpload');

// Build a mongoose filter + sort from the shared list query params.
const buildListQuery = (query, { forceOpen = false } = {}) => {
  const filter = {};

  if (forceOpen) {
    filter.status = 'Open';
  } else if (query.status) {
    filter.status = query.status;
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.featured !== undefined && query.featured !== '') {
    filter.featured = query.featured === 'true' || query.featured === true;
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { 'organization.name': { $regex: query.search, $options: 'i' } },
    ];
  }

  // Sort: support "-field" for descending, default to -publishedAt.
  let sort = { publishedAt: -1 };
  if (query.sort) {
    const field = query.sort.replace(/^-/, '');
    const direction = query.sort.startsWith('-') ? -1 : 1;
    sort = { [field]: direction };
  }

  return { filter, sort };
};

// GET /api/opportunities/public
const listPublicOpportunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { filter, sort } = buildListQuery(req.query, { forceOpen: true });

    const skip = (page - 1) * limit;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter).sort(sort).skip(skip).limit(limit),
      Opportunity.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
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
    });
  }
};

// GET /api/opportunities/admin
const listAdminOpportunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { filter, sort } = buildListQuery(req.query);

    const skip = (page - 1) * limit;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(filter).sort(sort).skip(skip).limit(limit),
      Opportunity.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        opportunities,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List admin opportunities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunities',
    });
  }
};

// GET /api/opportunities/:id
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Get opportunity by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunity',
    });
  }
};

// GET /api/opportunities/slug/:slug
const getOpportunityBySlug = async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({
      slug: req.params.slug,
      status: 'Open',
    });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Get opportunity by slug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve opportunity',
    });
  }
};

// GET /api/opportunities/featured
const getFeaturedOpportunities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;

    const opportunities = await Opportunity.find({
      featured: true,
      status: 'Open',
    })
      .sort({ publishedAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: opportunities,
    });
  } catch (error) {
    console.error('Get featured opportunities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured opportunities',
    });
  }
};

// POST /api/opportunities
const createOpportunity = async (req, res) => {
  try {
    const {
      type,
      title,
      org,
      date,
      status,
      visible,
      shortDescription,
      description,
      category,
      location,
      employmentType,
      salary,
      budget,
      contactEmail,
      contactPhone,
      requirements,
      benefits,
      featured,
    } = req.body;

    // Generate slug
    const baseSlug = Opportunity.generateSlug(title);
    const slug = await Opportunity.generateUniqueSlug(baseSlug);

    // Parse JSON strings for arrays
    let requirementsArray = [];
    let benefitsArray = [];

    if (requirements) {
      try {
        requirementsArray = JSON.parse(requirements);
        if (!Array.isArray(requirementsArray)) {
          requirementsArray = [String(requirementsArray)];
        }
      } catch {
        requirementsArray = [String(requirements)];
      }
    }

    if (benefits) {
      try {
        benefitsArray = JSON.parse(benefits);
        if (!Array.isArray(benefitsArray)) {
          benefitsArray = [String(benefitsArray)];
        }
      } catch {
        benefitsArray = [String(benefits)];
      }
    }

    // Map form status to model status
    const opportunityStatus = status === 'active' ? 'Open' : 'Closed';

    const opportunity = new Opportunity({
      type,
      title,
      slug,
      organization: {
        name: org,
      },
      shortDescription,
      description,
      category,
      location,
      employmentType: employmentType || null,
      salary: salary || null,
      budget: budget || null,
      deadline: new Date(date),
      publishedAt: new Date(),
      contact: {
        email: contactEmail,
        phone: contactPhone,
      },
      requirements: requirementsArray,
      benefits: benefitsArray,
      featured: featured === 'true' || featured === true,
      status: opportunityStatus,
      visible: visible === 'true' || visible === true,
      views: 0,
      applicants: null,
    });

    // Upload image if provided
    await handleImageUpdate(opportunity, req.file, 'rsk/opportunities');

    await opportunity.save();

    return res.status(201).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create opportunity',
    });
  }
};

// PUT /api/opportunities/:id
const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    const {
      type,
      title,
      org,
      date,
      status,
      visible,
      shortDescription,
      description,
      category,
      location,
      employmentType,
      salary,
      budget,
      contactEmail,
      contactPhone,
      requirements,
      benefits,
      featured,
    } = req.body;

    if (type !== undefined) opportunity.type = type;
    if (shortDescription !== undefined) opportunity.shortDescription = shortDescription;
    if (description !== undefined) opportunity.description = description;
    if (category !== undefined) opportunity.category = category;
    if (location !== undefined) opportunity.location = location;
    if (employmentType !== undefined) opportunity.employmentType = employmentType || null;
    if (salary !== undefined) opportunity.salary = salary || null;
    if (budget !== undefined) opportunity.budget = budget || null;
    if (contactEmail !== undefined) opportunity.contact.email = contactEmail;
    if (contactPhone !== undefined) opportunity.contact.phone = contactPhone;
    if (featured !== undefined) opportunity.featured = featured === 'true' || featured === true;
    if (visible !== undefined) opportunity.visible = visible === 'true' || visible === true;

    if (org !== undefined) {
      opportunity.organization.name = org;
    }

    if (date !== undefined) {
      opportunity.deadline = new Date(date);
    }

    if (status !== undefined) {
      opportunity.status = status === 'active' ? 'Open' : 'Closed';
    }

    if (requirements !== undefined) {
      try {
        const parsed = JSON.parse(requirements);
        opportunity.requirements = Array.isArray(parsed) ? parsed : [String(parsed)];
      } catch {
        opportunity.requirements = [String(requirements)];
      }
    }

    if (benefits !== undefined) {
      try {
        const parsed = JSON.parse(benefits);
        opportunity.benefits = Array.isArray(parsed) ? parsed : [String(parsed)];
      } catch {
        opportunity.benefits = [String(benefits)];
      }
    }

    if (title !== undefined) {
      opportunity.title = title;
      const baseSlug = Opportunity.generateSlug(title);
      opportunity.slug = await Opportunity.generateUniqueSlug(baseSlug, opportunity._id);
    }

    // Replace image only if a new file is provided.
    await handleImageUpdate(opportunity, req.file, 'rsk/opportunities');

    opportunity.updatedAt = new Date();
    await opportunity.save();

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update opportunity',
    });
  }
};

// DELETE /api/opportunities/:id
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    if (opportunity.imagePublicId) {
      await deleteFromCloudinary(opportunity.imagePublicId);
    }

    await opportunity.deleteOne();

    return res.status(204).send();
  } catch (error) {
    console.error('Delete opportunity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete opportunity',
    });
  }
};

// PATCH /api/opportunities/:id/status
const toggleOpportunityStatus = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    const { status } = req.body;
    opportunity.status = status === 'active' ? 'Open' : status === 'closed' ? 'Closed' : status;
    opportunity.updatedAt = new Date();
    await opportunity.save();

    return res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Toggle opportunity status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update opportunity status',
    });
  }
};

module.exports = {
  listPublicOpportunities,
  listAdminOpportunities,
  getOpportunityById,
  getOpportunityBySlug,
  getFeaturedOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  toggleOpportunityStatus,
};

const News = require('../models/News');

// Build a mongoose filter + sort from the shared list query params.
const buildListQuery = (query, { forcePublished = false } = {}) => {
  const filter = {};

  if (forcePublished) {
    filter.status = 'published';
  } else if (query.status) {
    filter.status = query.status;
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
      { excerpt: { $regex: query.search, $options: 'i' } },
    ];
  }

  let sort = { publishedAt: -1 };
  if (query.sort) {
    const field = query.sort.replace(/^-/, '');
    const direction = query.sort.startsWith('-') ? -1 : 1;
    sort = { [field]: direction };
  }

  return { filter, sort };
};

// GET /api/news-blog (public list - only published, limited fields)
const listPublicNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { filter, sort } = buildListQuery(req.query, { forcePublished: true });

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find(filter, { title: 1, excerpt: 1, coverImage: 1, slug: 1, publishedAt: 1, category: 1 })
        .sort(sort)
        .skip(skip)
        .limit(limit),
      News.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        news,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List public news error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve news',
    });
  }
};

// GET /api/news-blog/:slug (public detail - all fields)
const getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,
      status: 'published',
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Get news by slug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve news',
    });
  }
};

// GET /api/news-blog/admin (admin list - all news)
const listAdminNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { filter, sort } = buildListQuery(req.query);

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      News.find(filter).sort(sort).skip(skip).limit(limit),
      News.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        news,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List admin news error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve news',
    });
  }
};

// GET /api/news-blog/admin/:id (admin get one)
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Get news by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve news',
    });
  }
};

// POST /api/news-blog/admin (admin create)
const createNews = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, gallery, author, category, status, featured } = req.body;

    const baseSlug = News.generateSlug(title);
    const slug = await News.generateUniqueSlug(baseSlug);

    const news = new News({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || null,
      gallery: gallery || [],
      author: {
        name: author.name,
        avatar: author.avatar || null,
        role: author.role || null,
      },
      category: category || 'General',
      status: status || 'draft',
      featured: featured === 'true' || featured === true,
    });

    if (news.status === 'published') {
      news.publishedAt = new Date();
    }

    await news.save();

    return res.status(201).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Create news error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create news',
    });
  }
};

// PUT /api/news-blog/admin/:id (admin update)
const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    const { title, excerpt, content, coverImage, gallery, author, category, status, featured } = req.body;

    if (title !== undefined) news.title = title;
    if (excerpt !== undefined) news.excerpt = excerpt;
    if (content !== undefined) news.content = content;
    if (coverImage !== undefined) news.coverImage = coverImage;
    if (gallery !== undefined) news.gallery = gallery;
    if (category !== undefined) news.category = category;
    if (featured !== undefined) news.featured = featured === 'true' || featured === true;

    if (author !== undefined) {
      news.author.name = author.name;
      news.author.avatar = author.avatar || null;
      news.author.role = author.role || null;
    }

    if (title !== undefined) {
      const baseSlug = News.generateSlug(title);
      news.slug = await News.generateUniqueSlug(baseSlug, news._id);
    }

    if (status !== undefined) {
      news.status = status;
      if (status === 'published' && !news.publishedAt) {
        news.publishedAt = new Date();
      }
    }

    news.updatedAt = new Date();
    await news.save();

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Update news error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update news',
    });
  }
};

// DELETE /api/news-blog/admin/:id (admin delete)
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    await news.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'News deleted',
    });
  } catch (error) {
    console.error('Delete news error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete news',
    });
  }
};

// PATCH /api/news-blog/admin/:id/status (admin toggle status)
const toggleNewsStatus = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found',
      });
    }

    const { status } = req.body;
    news.status = status;

    if (status === 'published' && !news.publishedAt) {
      news.publishedAt = new Date();
    }

    news.updatedAt = new Date();
    await news.save();

    return res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('Toggle news status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update news status',
    });
  }
};

module.exports = {
  listPublicNews,
  getNewsBySlug,
  listAdminNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
};

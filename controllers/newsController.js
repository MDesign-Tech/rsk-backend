const NewsArticle = require('../models/NewsArticle');
const TeamMember = require('../models/TeamMember');

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

  // Sort: support "-field" for descending, default to -publishedAt.
  let sort = { publishedAt: -1 };
  if (query.sort) {
    const field = query.sort.replace(/^-/, '');
    const direction = query.sort.startsWith('-') ? -1 : 1;
    sort = { [field]: direction };
  }

  return { filter, sort };
};

// GET /api/news  (admin list)
const listArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { filter, sort } = buildListQuery(req.query);

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      NewsArticle.find(filter).sort(sort).skip(skip).limit(limit),
      NewsArticle.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        articles,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List articles error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve articles',
    });
  }
};

// GET /api/news/public  (public list, published only)
const listPublicArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { filter, sort } = buildListQuery(req.query, { forcePublished: true });

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      NewsArticle.find(filter).sort(sort).skip(skip).limit(limit),
      NewsArticle.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: {
        articles,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List public articles error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve articles',
    });
  }
};

// GET /api/news/:id  (admin)
const getArticleById = async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Get article by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve article',
    });
  }
};

// GET /api/news/public/:slug  (public)
const getArticleBySlug = async (req, res) => {
  try {
    const article = await NewsArticle.findOne({
      slug: req.params.slug,
      status: 'published',
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Get article by slug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve article',
    });
  }
};

// GET /api/news/featured
const getFeaturedArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;

    const articles = await NewsArticle.find({
      featured: true,
      status: 'published',
    })
      .sort({ publishedAt: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Get featured articles error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured articles',
    });
  }
};

// GET /api/news/category/:category  (public)
const getArticlesByCategory = async (req, res) => {
  try {
    const articles = await NewsArticle.find({
      category: req.params.category,
      status: 'published',
    }).sort({ publishedAt: -1 });

    return res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Get articles by category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve articles',
    });
  }
};

// Resolve author sub-document from a team member id.
const resolveAuthor = async (authorId) => {
  const member = await TeamMember.findById(authorId);
  if (!member) {
    return null;
  }
  return {
    _id: member._id,
    name: member.name,
    avatar: member.image || null,
    role: member.title || null,
  };
};

// POST /api/news  (create)
const createArticle = async (req, res) => {
  try {
    const { title, excerpt, content, category, author, status, featured, readingTime, image } = req.body;

    const authorData = await resolveAuthor(author);
    if (!authorData) {
      return res.status(400).json({
        success: false,
        message: 'Author not found',
      });
    }

    const baseSlug = NewsArticle.generateSlug(title);
    const slug = await NewsArticle.generateUniqueSlug(baseSlug);

    const article = new NewsArticle({
      title,
      slug,
      excerpt,
      content,
      category,
      author: authorData,
      status: status || 'published',
      featured: featured === 'true' || featured === true,
      readingTime: readingTime ? Number(readingTime) : 5,
      views: 0,
      likes: 0,
      shares: 0,
      commentsCount: 0,
      image: image || null,
    });

    if (article.status === 'published') {
      article.publishedAt = new Date();
    }

    await article.save();

    return res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Create article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create article',
    });
  }
};

// PUT /api/news/:id  (update, partial)
const updateArticle = async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    const { title, excerpt, content, category, author, status, featured, readingTime, image } = req.body;

    if (title !== undefined) article.title = title;
    if (excerpt !== undefined) article.excerpt = excerpt;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;
    if (featured !== undefined) article.featured = featured === 'true' || featured === true;
    if (readingTime !== undefined) article.readingTime = Number(readingTime);
    if (image !== undefined) article.image = image;

    if (author !== undefined) {
      const authorData = await resolveAuthor(author);
      if (!authorData) {
        return res.status(400).json({
          success: false,
          message: 'Author not found',
        });
      }
      article.author = authorData;
    }

    if (title !== undefined) {
      const baseSlug = NewsArticle.generateSlug(title);
      article.slug = await NewsArticle.generateUniqueSlug(baseSlug, article._id);
    }

    if (status !== undefined) {
      article.status = status;
      if (status === 'published' && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    article.updatedAt = new Date();
    await article.save();

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Update article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update article',
    });
  }
};

// DELETE /api/news/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    await article.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Article deleted',
    });
  } catch (error) {
    console.error('Delete article error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete article',
    });
  }
};

// PATCH /api/news/:id/status
const toggleArticleStatus = async (req, res) => {
  try {
    const article = await NewsArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    const { status } = req.body;
    article.status = status;

    if (status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    article.updatedAt = new Date();
    await article.save();

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Toggle article status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update article status',
    });
  }
};

// GET /api/team-members  (author dropdown)
const listTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ visible: true }).sort({ createdAt: 1 });

    const data = members.map((m) => ({
      _id: m._id,
      name: m.name,
      title: m.title,
      image: m.image || null,
      visible: m.visible,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('List team members error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve team members',
    });
  }
};

module.exports = {
  listArticles,
  listPublicArticles,
  getArticleById,
  getArticleBySlug,
  getFeaturedArticles,
  getArticlesByCategory,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleStatus,
  listTeamMembers,
};

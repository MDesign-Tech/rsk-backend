const mongoose = require('mongoose');
const News = require('../models/News');
const Category = require('../models/Category');
const TeamMember = require('../models/TeamMember');

// Resolve a category: accept either a MongoId or a category name.
const resolveCategory = async (categoryInput) => {
  if (!categoryInput) return null;
  // If it looks like a MongoId, use it directly.
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    const cat = await Category.findById(categoryInput);
    return cat;
  }
  // Otherwise, treat it as a category name.
  const cat = await Category.findOne({ name: categoryInput });
  return cat;
};

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

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
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
      News.find(filter).sort(sort).skip(skip).limit(limit).populate('category'),
      News.countDocuments(filter),
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
      News.find(filter).sort(sort).skip(skip).limit(limit).populate('category'),
      News.countDocuments(filter),
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
    const article = await News.findById(req.params.id).populate('category');

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
    const article = await News.findOne({
      slug: req.params.slug,
      status: 'published',
    }).populate('category');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Get article by slug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve article',
    });
  }
};

// GET /api/news/category/:categoryId  (public)
const getArticlesByCategory = async (req, res) => {
  try {
    const articles = await News.find({
      category: req.params.categoryId,
      status: 'published',
    }).sort({ publishedAt: -1 }).populate('category');

    return res.status(200).json({
      success: true,
      data: { articles },
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
    const { title, content, category, authorId, status, coverImage } = req.body;

    const authorData = await resolveAuthor(authorId);
    if (!authorData) {
      return res.status(400).json({
        success: false,
        message: 'Author not found',
      });
    }

    const categoryDoc = await resolveCategory(category);
    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: 'Category not found',
      });
    }

    const baseSlug = News.generateSlug(title);
    const slug = await News.generateUniqueSlug(baseSlug);

    const article = new News({
      title,
      slug,
      content,
      category: categoryDoc._id,
      author: authorData,
      status: status || 'published',
      coverImage: coverImage || null,
    });

    if (article.status === 'published') {
      article.publishedAt = new Date();
    }

    await article.save();
    await article.populate('category');

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
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    const { title, content, category, authorId, status, coverImage } = req.body;

    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (coverImage !== undefined) article.coverImage = coverImage;

    if (category !== undefined) {
      const categoryDoc = await resolveCategory(category);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
        });
      }
      article.category = categoryDoc._id;
    }

    if (authorId !== undefined) {
      const authorData = await resolveAuthor(authorId);
      if (!authorData) {
        return res.status(400).json({
          success: false,
          message: 'Author not found',
        });
      }
      article.author = authorData;
    }

    if (title !== undefined) {
      const baseSlug = News.generateSlug(title);
      article.slug = await News.generateUniqueSlug(baseSlug, article._id);
    }

    if (status !== undefined) {
      article.status = status;
      if (status === 'published' && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    article.updatedAt = new Date();
    await article.save();
    await article.populate('category');

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
    const article = await News.findById(req.params.id);

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
    const article = await News.findById(req.params.id);

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
  getArticlesByCategory,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleStatus,
  listTeamMembers,
};

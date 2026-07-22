const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: [true, 'Author is required'],
      },
      name: {
        type: String,
        required: [true, 'Author name is required'],
      },
      avatar: {
        type: String,
        default: null,
      },
      role: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number,
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
newsArticleSchema.index({ slug: 1 }, { unique: true });
newsArticleSchema.index({ status: 1 });
newsArticleSchema.index({ category: 1 });
newsArticleSchema.index({ publishedAt: -1 });
newsArticleSchema.index({ featured: 1 });

/**
 * Generate a URL-friendly slug from a title.
 * 1. lowercase
 * 2. spaces -> hyphens
 * 3. keep only a-z, 0-9, hyphens
 * 4. truncate to 80 chars
 */
const generateBaseSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
};

/**
 * Ensure slug uniqueness by appending -1, -2, etc. when a collision occurs.
 */
const generateUniqueSlug = async function (baseSlug, excludeId = null) {
  let slug = baseSlug || 'article';
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await mongoose.model('NewsArticle').findOne(query);
    if (!exists) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

newsArticleSchema.statics.generateSlug = generateBaseSlug;
newsArticleSchema.statics.generateUniqueSlug = generateUniqueSlug;

module.exports = mongoose.model('NewsArticle', newsArticleSchema);

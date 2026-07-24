const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: null,
    },
    gallery: [
      {
        type: String,
      },
    ],
    author: {
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
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

newsSchema.index({ slug: 1 }, { unique: true });
newsSchema.index({ status: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ publishedAt: -1 });

/**
 * Generate a URL-friendly slug from a title.
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
  let slug = baseSlug || 'news';
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await mongoose.model('News').findOne(query);
    if (!exists) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

newsSchema.statics.generateSlug = generateBaseSlug;
newsSchema.statics.generateUniqueSlug = generateUniqueSlug;

module.exports = mongoose.model('News', newsSchema);

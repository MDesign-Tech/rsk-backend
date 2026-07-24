const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OpportunityType',
      required: [true, 'Type is required'],
    },
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
    org: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    location: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    visible: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

opportunitySchema.index({ slug: 1 }, { unique: true });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ type: 1 });
opportunitySchema.index({ visible: 1 });
opportunitySchema.index({ date: -1 });

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
  let slug = baseSlug || 'opportunity';
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await mongoose.model('Opportunity').findOne(query);
    if (!exists) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

opportunitySchema.statics.generateSlug = generateBaseSlug;
opportunitySchema.statics.generateUniqueSlug = generateUniqueSlug;

module.exports = mongoose.model('Opportunity', opportunitySchema);

const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
      enum: ['Tender', 'Job', 'Internship', 'Consultancy', 'RFP', 'RFQ', 'EOI', 'Training', 'Event'],
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
    organization: {
      name: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true,
      },
      logo: {
        type: String,
        default: null,
      },
      website: {
        type: String,
        default: null,
      },
    },
    image: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      default: null,
      trim: true,
    },
    salary: {
      type: String,
      default: null,
      trim: true,
    },
    budget: {
      type: String,
      default: null,
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    publishedAt: {
      type: Date,
    },
    contact: {
      email: {
        type: String,
        required: [true, 'Contact email is required'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Contact phone is required'],
        trim: true,
      },
    },
    requirements: {
      type: [String],
      default: [],
    },
    documents: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
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
    views: {
      type: Number,
      default: 0,
    },
    applicants: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
opportunitySchema.index({ slug: 1 }, { unique: true });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ type: 1 });
opportunitySchema.index({ featured: 1 });
opportunitySchema.index({ publishedAt: -1 });
opportunitySchema.index({ deadline: 1 });

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
  let slug = baseSlug || 'opportunity';
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
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

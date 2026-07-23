const mongoose = require('mongoose');

const opportunityTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('OpportunityType', opportunityTypeSchema);

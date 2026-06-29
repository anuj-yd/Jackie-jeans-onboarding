const mongoose = require('mongoose');

const fitProfileSchema = mongoose.Schema(
  {
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: false,
    },
    waist: {
      type: String,
      required: true,
    },
    hip: {
      type: String,
      required: true,
    },
    waistFit: {
      type: String,
      required: true,
    },
    waistband: {
      type: String,
      required: true,
    },
    thighFit: {
      type: String,
      required: true,
    },
    brands: {
      type: [String],
      required: true,
    },
    brandSizes: {
      type: [
        {
          brand: String,
          size: String,
        },
      ],
      required: true,
    },
    frustration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FitProfile = mongoose.model('FitProfile', fitProfileSchema);

module.exports = FitProfile;

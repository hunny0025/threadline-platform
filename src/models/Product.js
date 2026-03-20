const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: [{ type: String }],
    tags: [{ type: String, trim: true, lowercase: true }],
    fitType: {
      type: String,
      enum: ['slim', 'regular', 'oversized'],
      default: 'regular',
    },
    fabricWeight: {
      type: String,
      enum: ['light', 'medium', 'heavy'],
      default: 'medium',
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index for filtering
productSchema.index({ category: 1, isActive: 1, basePrice: 1 });

// Text index for search
productSchema.index(
  { name: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, tags: 5, description: 1 }, name: 'product_text_index' }
);

module.exports = mongoose.model('Product', productSchema);
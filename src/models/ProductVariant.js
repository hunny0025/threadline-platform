const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

productVariantSchema.index({ product: 1 });
productVariantSchema.index({ sku: 1 }, { unique: true });

module.exports = mongoose.model('ProductVariant', productVariantSchema);
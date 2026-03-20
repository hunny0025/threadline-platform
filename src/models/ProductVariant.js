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

// ─── IMPROVEMENT 3: Compound Unique Index on ProductVariant ──────────────────
//
// WHAT WAS WRONG:
// There was only a single index on 'product'. The checkStock endpoint queries
// by product + size + color every time a customer clicks a size or color on
// the product page. With only the product index, MongoDB found all variants
// of that product (typically 6-12 documents) and then manually scanned all
// of them to find the one matching size AND color.
// This is the highest-frequency query in the app — runs on every single
// size/color selection by every customer simultaneously.
//
// WHY THIS FIX:
// A compound index on product + size + color covers all three fields the
// checkStock query uses. MongoDB now jumps directly to the exact variant
// in one lookup — no scanning the other variants at all.
//
// THE unique: true BONUS:
// Also prevents a data entry mistake where the same product accidentally
// gets two variants with identical size + color. That would cause checkStock
// to return unpredictable results since findOne would pick randomly between
// two matching documents.
//
// REAL IMPACT:
// Every size/color click on every product page becomes a direct index lookup.
// At 500 concurrent users selecting sizes: eliminates thousands of
// unnecessary document reads per second.
//
productVariantSchema.index({ product: 1, size: 1, color: 1 }, { unique: true });


module.exports = mongoose.model('ProductVariant', productVariantSchema);


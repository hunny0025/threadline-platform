const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    trim: true
  }

},
{
  timestamps: true
}
);

// ─── IMPROVEMENT 2: Unique Compound Index on Review ──────────────────────────
//
// WHAT WAS WRONG:
// There was no rule stopping one user from submitting multiple reviews on the
// same product. A user could leave 100 reviews on one t-shirt, flooding the
// ratings and destroying the average shown to other shoppers.
// Even a frontend bug (submit button firing twice) would silently create
// duplicate reviews with no error.
//
// WHY THIS FIX:
// A unique compound index on userId + productId tells MongoDB:
// "One user can only have ONE review per product. Reject any duplicate."
// This is enforced at the database level — even if the controller code has
// a bug, MongoDB will block the duplicate automatically.
//
// WHY DATABASE LEVEL IS SAFER THAN CONTROLLER LEVEL:
// If we only check in the controller, two simultaneous requests from the
// same user can both pass the check before either is saved — a race condition.
// A database unique index is atomic — only one insert wins, period.
//
// REAL IMPACT:
// Protects rating integrity for every product on the platform.
// One user = one honest review per product. Always.
//
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);



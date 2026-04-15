const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    // Array of Cloudinary image URLs attached to the review
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    // True if this user actually purchased the product (set during order creation)
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One review per user per product — enforced at DB level (atomic, race-condition safe)
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Static method: get average rating + count for a product
// Usage: await Review.getAverageRating(productId)
reviewSchema.statics.getAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: '$rating',
        },
      },
    },
    {
      $addFields: {
        avgRating: { $round: ['$avgRating', 1] },
      },
    },
  ]);

  if (result.length === 0) {
    return { avgRating: 0, totalReviews: 0 };
  }

  // Build 1–5 star breakdown counts
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result[0].ratingBreakdown.forEach((r) => {
    breakdown[r] = (breakdown[r] || 0) + 1;
  });

  return {
    avgRating: result[0].avgRating,
    totalReviews: result[0].totalReviews,
    breakdown,
  };
};

module.exports = mongoose.model('Review', reviewSchema);

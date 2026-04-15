const Review = require('../models/Review');
const Order = require('../models/Order');
const { sendSuccess, sendError } = require('../utils/response');
const cloudinary = require('cloudinary').v2;

// POST /products/:productId/reviews
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const productId = req.params.productId;

    if (!rating || rating < 1 || rating > 5) {
      return sendError(res, 'Rating must be between 1 and 5', 400);
    }

    // Check verifiedPurchase — did this user actually buy this product?
    const hasPurchased = await Order.findOne({
      userId,
      'items.productId': productId,
      // Only count paid/delivered orders
    });
    const verifiedPurchase = !!hasPurchased;

    // Upload up to 3 review images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files.slice(0, 3)) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'threadline/reviews',
        });
        imageUrls.push(result.secure_url);
      }
    }

    const review = await Review.create({
      userId,
      productId,
      rating: Number(rating),
      comment,
      images: imageUrls,
      verifiedPurchase,
    });

    sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, 'You have already reviewed this product', 409);
    }
    sendError(res, err.message, 500);
  }
};

// GET /products/:productId/reviews
// Returns reviews list + avgRating aggregation
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const [reviews, ratingStats] = await Promise.all([
      Review.find({ productId })
        .populate('userId', 'name avatar')
        .sort({ verifiedPurchase: -1, createdAt: -1 }), // verified first
      Review.getAverageRating(productId),
    ]);

    sendSuccess(
      res,
      {
        stats: ratingStats,   // { avgRating, totalReviews, breakdown }
        reviews,
      },
      'Reviews fetched successfully'
    );
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

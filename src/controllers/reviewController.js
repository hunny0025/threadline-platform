const Review = require('../models/Review');
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

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'threadline/reviews',
      });
      imageUrl = result.secure_url;
    }

    const review = await Review.create({
      userId,
      productId,
      rating: Number(rating),
      comment,
      image: imageUrl,
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
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    sendSuccess(res, reviews, 'Reviews fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');

exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return sendError(res, 'Search query must be at least 2 characters', 400);
    }

    const startTime = Date.now();

    const results = await Product.find(
      {
        $text: { $search: q },
        isActive: true,
      },
      {
        score: { $meta: 'textScore' },
        name: 1,
        slug: 1,
        basePrice: 1,
        images: 1,
        category: 1,
        gender: 1,
        fitType: 1,
      }
    )
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();

    const responseTime = Date.now() - startTime;

    // Format results with thumbnail
    const formatted = results.map((p) => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      thumbnail: p.images?.[0] || null,
      category: p.category,
      gender: p.gender,
      fitType: p.fitType,
      score: p.score,
    }));

    sendSuccess(res, {
      query: q,
      count: formatted.length,
      responseTimeMs: responseTime,
      results: formatted,
    }, 'Search results fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
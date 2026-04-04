const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');
const { get: redisGet, set: redisSet, searchKey } = require('../db/redis');

const CACHE_TTL = 300; // 5 minutes

exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return sendError(res, 'Search query must be at least 2 characters', 400);
    }

    // Check cache first
    const cacheKey = searchKey(q);
    const cached = await redisGet(cacheKey);
    if (cached) {
      cached.responseTimeMs = 0; // Indicate cached response
      cached.cached = true;
      return sendSuccess(res, cached, 'Search results fetched successfully (cached)');
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

    const result = {
      query: q,
      count: formatted.length,
      responseTimeMs: responseTime,
      results: formatted,
    };

    // Cache the search result
    await redisSet(cacheKey, result, CACHE_TTL);

    sendSuccess(res, result, 'Search results fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
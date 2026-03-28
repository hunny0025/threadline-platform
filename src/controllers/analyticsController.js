const AnalyticsEvent = require('../models/AnalyticsEvent');
const { successResponse, errorResponse } = require('../utils/response');

function detectDevice(ua = '') {
  const s = ua.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(s)) return 'mobile';
  if (/tablet|ipad/.test(s)) return 'tablet';
  if (s.length > 0) return 'desktop';
  return 'unknown';
}

function extractIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    null
  );
}

const VALID_EVENTS = new Set(['page_view', 'product_click', 'cart_add']);

function validateAndBuildPayload(eventType, body) {
  const payload = {};
  switch (eventType) {
    case 'page_view': {
      if (!body.page || typeof body.page !== 'string') {
        return { valid: false, error: '"page" (string) is required for page_view events.' };
      }
      payload.page = body.page.slice(0, 500);
      payload.referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null;
      break;
    }
    case 'product_click': {
      if (!body.productId) {
        return { valid: false, error: '"productId" is required for product_click events.' };
      }
      payload.productId = body.productId;
      payload.productName = body.productName || null;
      payload.variantId = body.variantId || null;
      payload.category = body.category || null;
      break;
    }
    case 'cart_add': {
      if (!body.productId) {
        return { valid: false, error: '"productId" is required for cart_add events.' };
      }
      payload.productId = body.productId;
      payload.productName = body.productName || null;
      payload.variantId = body.variantId || null;
      payload.category = body.category || null;
      payload.quantity = typeof body.quantity === 'number' ? body.quantity : 1;
      payload.price = typeof body.price === 'number' ? body.price : null;
      break;
    }
    default:
      return { valid: false, error: `Unknown eventType: ${eventType}` };
  }
  return { valid: true, payload };
}

exports.logEvent = async (req, res) => {
  try {
    const { eventType, sessionId, userId, ...rest } = req.body;
    if (!eventType || !VALID_EVENTS.has(eventType)) {
      return res.status(400).json(errorResponse(`"eventType" must be one of: ${[...VALID_EVENTS].join(', ')}.`, 400));
    }
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length < 8) {
      return res.status(400).json(errorResponse('"sessionId" is required and must be a string (min 8 chars).', 400));
    }
    const { valid, error, payload } = validateAndBuildPayload(eventType, rest);
    if (!valid) {
      return res.status(400).json(errorResponse(error, 400));
    }
    const ua = req.headers['user-agent'] || '';
    const meta = {
      userAgent: ua.slice(0, 300),
      ip: extractIp(req),
      device: detectDevice(ua),
      country: req.headers['cf-ipcountry'] || null,
    };
    const event = await AnalyticsEvent.create({
      eventType,
      sessionId: sessionId.trim(),
      userId: userId || null,
      payload,
      meta,
    });
    return res.status(201).json(successResponse({ eventId: event._id }, 'Event logged successfully.', 201));
  } catch (err) {
    console.error('[Analytics] logEvent error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json(errorResponse(`Invalid ID format: ${err.path}`, 400));
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json(errorResponse(err.message, 400));
    }
    return res.status(500).json(errorResponse('Internal server error while logging event.', 500));
  }
};

exports.getAnalyticsSummary = async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days, 10) || 30, 90);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const [eventCounts, topProducts, deviceBreakdown, dailyVolume] = await Promise.all([
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { eventType: 'cart_add', createdAt: { $gte: since } } },
        { $group: { _id: '$payload.productId', name: { $first: '$payload.productName' }, cartAdds: { $sum: 1 }, revenue: { $sum: { $multiply: ['$payload.price', '$payload.quantity'] } } } },
        { $sort: { cartAdds: -1 } },
        { $limit: 10 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$meta.device', count: { $sum: 1 } } },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, type: '$eventType' }, count: { $sum: 1 } } },
        { $sort: { '_id.date': 1 } },
      ]),
    ]);
    return res.status(200).json(successResponse({ window: { days, since }, eventCounts, topProducts, deviceBreakdown, dailyVolume }, 'Analytics summary retrieved.', 200));
  } catch (err) {
    console.error('[Analytics] getAnalyticsSummary error:', err);
    return res.status(500).json(errorResponse('Failed to fetch analytics summary.', 500));
  }
};
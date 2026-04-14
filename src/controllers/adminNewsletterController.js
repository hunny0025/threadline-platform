const Newsletter = require('../models/Newsletter');
const { sendSuccess, sendError } = require('../utils/response');

// GET /newsletter/admin/subscribers
exports.getSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50, active } = req.query;

    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';

    const total = await Newsletter.countDocuments(filter);
    const subscribers = await Newsletter.find(filter)
      .select('email isActive subscribedAt')
      .sort({ subscribedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    sendSuccess(res, { subscribers, total, page: Number(page) }, 'Subscribers fetched');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// DELETE /newsletter/admin/subscribers/:email
exports.removeSubscriber = async (req, res) => {
  try {
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { isActive: false },
      { new: true }
    );
    if (!subscriber) return sendError(res, 'Subscriber not found', 404);
    sendSuccess(res, null, 'Subscriber removed');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

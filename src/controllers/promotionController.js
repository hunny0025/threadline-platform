const Promotion = require('../models/Promotion');
const { sendSuccess, sendError } = require('../utils/response');

// GET /promotions — active promotions for frontend
exports.getActivePromotions = async (req, res) => {
  try {
    const now = new Date();
    const promos = await Promotion.find({
      isActive: true,
      startsAt: { $lte: now },
      endsAt:   { $gte: now },
    }).sort({ sortOrder: 1 });
    sendSuccess(res, promos, 'Promotions fetched');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// POST /admin/promotions — create (admin only)
exports.createPromotion = async (req, res) => {
  try {
    const promo = await Promotion.create(req.body);
    sendSuccess(res, promo, 'Promotion created', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// PATCH /admin/promotions/:id
exports.updatePromotion = async (req, res) => {
  try {
    const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return sendError(res, 'Promotion not found', 404);
    sendSuccess(res, promo, 'Promotion updated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// DELETE /admin/promotions/:id
exports.deletePromotion = async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, 'Promotion deleted');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

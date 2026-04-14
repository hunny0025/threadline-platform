const Coupon = require('../models/Coupon');
const { sendSuccess, sendError } = require('../utils/response');

// POST /coupons/validate
// Body: { code, cartTotal }
// Validates coupon and returns discount amount — does NOT apply yet
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const userId = req.user._id;

    if (!code || !cartTotal) {
      return sendError(res, 'code and cartTotal are required', 400);
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    // 1. Does it exist?
    if (!coupon) return sendError(res, 'Invalid coupon code', 404);

    // 2. Is it active?
    if (!coupon.isActive) return sendError(res, 'This coupon is no longer active', 400);

    // 3. Has it expired?
    if (new Date() > coupon.expiresAt) {
      return sendError(res, 'This coupon has expired', 400);
    }

    // 4. Max uses reached?
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return sendError(res, 'This coupon has reached its usage limit', 400);
    }

    // 5. Single-use per user check
    if (coupon.usedBy.some((id) => id.toString() === userId.toString())) {
      return sendError(res, 'You have already used this coupon', 409);
    }

    // 6. Minimum order amount check
    if (Number(cartTotal) < coupon.minOrderAmount) {
      return sendError(
        res,
        `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`,
        400
      );
    }

    // 7. Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((Number(cartTotal) * coupon.discountValue) / 100);
    } else {
      // flat
      discountAmount = Math.min(coupon.discountValue, Number(cartTotal));
    }

    const finalTotal = Number(cartTotal) - discountAmount;

    sendSuccess(res, {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      originalTotal: Number(cartTotal),
      finalTotal,
    }, 'Coupon is valid');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// POST /coupons/apply
// Body: { code, orderId }
// Actually marks the coupon as used — call AFTER order is created
exports.applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) return sendError(res, 'code is required', 400);

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) return sendError(res, 'Coupon not found', 404);

    // Re-validate before applying (guard against race conditions)
    if (!coupon.isActive) return sendError(res, 'Coupon is inactive', 400);
    if (new Date() > coupon.expiresAt) return sendError(res, 'Coupon has expired', 400);
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return sendError(res, 'Coupon usage limit reached', 400);
    }
    if (coupon.usedBy.some((id) => id.toString() === userId.toString())) {
      return sendError(res, 'You have already used this coupon', 409);
    }

    // Atomically increment usedCount and push userId
    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { usedCount: 1 },
      $push: { usedBy: userId },
    });

    sendSuccess(res, { code: coupon.code }, 'Coupon applied successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// POST /admin/coupons — create coupon (admin only)
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    sendSuccess(res, coupon, 'Coupon created successfully', 201);
  } catch (err) {
    if (err.code === 11000) return sendError(res, 'Coupon code already exists', 409);
    sendError(res, err.message, 500);
  }
};

// GET /admin/coupons — list all (admin only)
exports.listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    sendSuccess(res, coupons, 'Coupons fetched');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// DELETE /admin/coupons/:id — deactivate (admin only)
exports.deactivateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!coupon) return sendError(res, 'Coupon not found', 404);
    sendSuccess(res, coupon, 'Coupon deactivated');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

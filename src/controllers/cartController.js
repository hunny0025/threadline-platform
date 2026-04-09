const Cart = require('../models/Cart');
const ProductVariant = require('../models/ProductVariant');
const { reserveStock, releaseByVariant } = require('../services/stockService');
const { sendSuccess, sendError } = require('../utils/response');

const getOrCreateCart = async (userId, sessionId) => {
  let cart;

  if (userId) {
    cart = await Cart.findOne({ userId });
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId });
  }

  if (!cart) {
    cart = new Cart({
      userId: userId || null,
      sessionId: sessionId || null,
      items: [],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  return cart;
};

// GET /cart
// GET /cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;

    if (!userId && !sessionId) {
      return sendError(res, 'Session ID or auth token required', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);
    await cart.populate('items.variant');

    return sendSuccess(res, cart, 'Cart fetched successfully');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /cart/add
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { variantId, quantity = 1 } = req.body;

    if (!variantId) return sendError(res, 'variantId is required', 400);
    if (quantity < 0) return sendError(res, 'Invalid quantity', 400);

    const variant = await ProductVariant.findById(variantId);
    if (!variant) return sendError(res, 'Variant not found', 404);

    try {
      await reserveStock(variantId, quantity, userId, sessionId);
    } catch (err) {
      return sendError(res, err.message, 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    const existingItem = cart.items.find(
      item => item.variant.toString() === variantId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ variant: variantId, quantity });
    }

    cart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await cart.save();

    return sendSuccess(res, cart, 'Item added to cart', 201);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PATCH /cart/update
exports.updateCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { variantId, quantity } = req.body;

    if (!variantId || quantity === undefined) {
      return sendError(res, 'variantId and quantity are required', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (quantity === 0) {
      try {
        await releaseByVariant(variantId, userId, sessionId);
      } catch (err) {
        console.error('Release failed:', err.message);
      }

      cart.items = cart.items.filter(
        i => i.variant.toString() !== variantId
      );

      await cart.save();

      return sendSuccess(res, cart, 'Item removed from cart');
    }

    const item = cart.items.find(
      i => i.variant.toString() === variantId
    );

    if (!item) {
      return sendError(res, 'Item not found in cart', 404);
    }

    if (quantity < 0) {
      return sendError(res, 'Invalid quantity', 400);
    }

    item.quantity = quantity;

    await cart.save();

    return sendSuccess(res, cart, 'Cart updated successfully');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /cart/remove
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { variantId } = req.body;

    if (!variantId) return sendError(res, 'variantId is required', 400);

    try {
      await releaseByVariant(variantId, userId, sessionId);
    } catch (err) {
      console.error('Release failed:', err.message);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    cart.items = cart.items.filter(
      i => i.variant.toString() !== variantId
    );

    await cart.save();

    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /cart/merge
exports.mergeCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionId } = req.body;

    if (!sessionId) return sendError(res, 'sessionId is required', 400);

    const guestCart = await Cart.findOne({ sessionId });

    if (!guestCart || guestCart.items.length === 0) {
      return sendSuccess(res, null, 'No guest cart to merge');
    }

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      guestCart.userId = userId;
      guestCart.sessionId = null;
      await guestCart.save();
      return sendSuccess(res, guestCart, 'Cart merged successfully');
    }

    guestCart.items.forEach(guestItem => {
      const existing = userCart.items.find(
        i => i.variant.toString() === guestItem.variant.toString()
      );

      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    await userCart.save();
    await guestCart.deleteOne();

    return sendSuccess(res, userCart, 'Cart merged successfully');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};
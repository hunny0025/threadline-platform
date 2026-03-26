const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { sendSuccess, sendError } = require('../utils/response');
const { paginate } = require('../utils/pagination');

// POST /orders
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod = 'cod' } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ userId }).populate('items.variant');
    if (!cart || cart.items.length === 0) {
      return sendError(res, 'Cart is empty', 400);
    }

    // Build order items and calculate total
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const price = item.variant.price || 0;
      totalAmount += price * item.quantity;
      return {
        productId: item.variant.product,
        variantId: item.variant._id,
        size: item.variant.size,
        color: item.variant.color,
        price,
        quantity: item.quantity,
      };
    });

    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      statusHistory: [{ status: 'placed' }],
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    sendSuccess(res, order, 'Order placed successfully', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// GET /orders (user history)
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const total = await Order.countDocuments({ userId });
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    sendSuccess(res, paginate(orders, total, page, limit), 'Orders fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// GET /orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) return sendError(res, 'Order not found', 404);
    sendSuccess(res, order, 'Order fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// PATCH /orders/:id/status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 'Order not found', 404);

    order.statusHistory.push({ status });
    await order.save();
    sendSuccess(res, order, 'Order status updated successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// POST /orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) return sendError(res, 'Order not found', 404);

    const lastStatus = order.statusHistory[order.statusHistory.length - 1]?.status;
    if (['shipped', 'delivered'].includes(lastStatus)) {
      return sendError(res, 'Cannot cancel order that is shipped or delivered', 400);
    }

    order.statusHistory.push({ status: 'cancelled' });
    await order.save();
    sendSuccess(res, order, 'Order cancelled successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
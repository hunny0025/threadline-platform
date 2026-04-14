const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PaymentTransaction = require('../models/PaymentTransaction'); // eslint-disable-line no-unused-vars
const { decrementOnOrder } = require('../services/stockService');
const { sendSuccess, sendError } = require('../utils/response');
const { paginate } = require('../utils/pagination');

// POST /orders  — with MongoDB session transaction
exports.createOrder = async (req, res) => {
  // Start a MongoDB session for the transaction
  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const userId = req.user.id;

      // 1. Load cart (outside session — read-only)
      const cart = await Cart.findOne({ userId }).populate('items.variant');
      if (!cart || cart.items.length === 0) {
        throw new Error('CART_EMPTY');
      }

      // 2. Decrement stock atomically for each item
      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart.items) {
        await decrementOnOrder(
          item.variant._id,
          item.quantity,
          userId,
          null
        );

        const price = item.variant.price || 0;
        totalAmount += price * item.quantity;
        orderItems.push({
          productId: item.variant.product,
          variantId: item.variant._id,
          name:     item.variant.sku || '',
          size:     item.variant.size,
          color:    item.variant.color,
          price,
          quantity: item.quantity,
        });
      }

      // 3. Create the order document (inside session)
      const [order] = await Order.create(
        [{ userId, items: orderItems, totalAmount, statusHistory: [{ status: 'placed' }] }],
        { session }
      );

      // 4. Clear the cart (inside session)
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { session }
      );

      createdOrder = order;
    });

    sendSuccess(res, createdOrder, 'Order placed successfully', 201);
  } catch (err) {
    if (err.message === 'CART_EMPTY') {
      return sendError(res, 'Cart is empty', 400);
    }
    sendError(res, err.message, 500);
  } finally {
    session.endSession();
  }
};

// GET /orders — user order history
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
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return sendError(res, 'Order not found', 404);
    sendSuccess(res, order, 'Order fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// PATCH /orders/:id/status — admin
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
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
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

// GET /admin/orders — all orders with filters + CSV export
exports.adminGetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, userId, exportCsv } = req.query;

    const filter = {};
    if (status) filter['statusHistory'] = { $elemMatch: { status } };
    if (userId) filter.userId = userId;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // CSV export
    if (exportCsv === 'true') {
      const rows = [
        'OrderID,UserEmail,TotalAmount,Status,Date',
        ...orders.map((o) => {
          const lastStatus = o.statusHistory[o.statusHistory.length - 1]?.status || '';
          const email = o.userId?.email || '';
          return `${o._id},${email},${o.totalAmount},${lastStatus},${o.createdAt.toISOString()}`;
        }),
      ];
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
      return res.send(rows.join('\n'));
    }

    sendSuccess(res, paginate(orders, total, page, limit), 'Admin orders fetched');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

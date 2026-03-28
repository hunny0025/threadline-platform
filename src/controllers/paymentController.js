const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { sendSuccess, sendError } = require('../utils/response');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
});

exports.createIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return sendError(res, 'orderId is required', 400);
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) return sendError(res, 'Order not found', 404);
    const options = {
      amount: order.totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${orderId}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    sendSuccess(res, {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId,
    }, 'Payment intent created', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return sendError(res, 'All payment fields are required', 400);
    }
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expectedSignature !== razorpaySignature) {
      return sendError(res, 'Invalid payment signature', 400);
    }
    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 'Order not found', 404);
    order.statusHistory.push({ status: 'paid' });
    await order.save();
    sendSuccess(res, order, 'Payment confirmed successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

exports.webhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }
    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;
    if (event === 'payment.captured') {
      console.log('Payment succeeded:', paymentEntity?.id);
    } else if (event === 'payment.failed') {
      console.log('Payment failed:', paymentEntity?.id);
    }
    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refund = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    if (!paymentId) return sendError(res, 'paymentId is required', 400);
    const refundOptions = {};
    if (amount) refundOptions.amount = amount * 100;
    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    sendSuccess(res, refund, 'Refund initiated successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
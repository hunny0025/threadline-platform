const ProductVariant = require('../models/ProductVariant');
const StockReservation = require('../models/StockReservation');

const RESERVATION_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Reserve stock when item added to cart
exports.reserveStock = async (variantId, quantity, userId, sessionId) => {
  const variant = await ProductVariant.findById(variantId);
  if (!variant) throw new Error('Variant not found');

  const available = variant.stock - variant.reserved;
  if (available < quantity) {
    throw new Error(`Only ${available} units available`);
  }

  // Atomically increment reserved
  const updated = await ProductVariant.findOneAndUpdate(
    {
      _id: variantId,
      $expr: { $gte: [{ $subtract: ['$stock', '$reserved'] }, quantity] },
    },
    { $inc: { reserved: quantity } },
    { new: true }
  );

  if (!updated) throw new Error('Insufficient stock — oversell blocked');

  const expiresAt = new Date(Date.now() + RESERVATION_TTL_MS);

  const reservation = await StockReservation.create({
    variantId,
    quantity,
    userId: userId || null,
    sessionId: sessionId || null,
    expiresAt,
  });

  return reservation;
};

// Release reservation when cart item removed or TTL expires
exports.releaseReservation = async (reservationId) => {
  const reservation = await StockReservation.findById(reservationId);
  if (!reservation) return;

  await ProductVariant.findByIdAndUpdate(
    reservation.variantId,
    { $inc: { reserved: -reservation.quantity } }
  );

  await reservation.deleteOne();
};

// Release by variantId + session/user (when removing from cart)
exports.releaseByVariant = async (variantId, userId, sessionId) => {
  const query = { variantId };
  if (userId) query.userId = userId;
  else if (sessionId) query.sessionId = sessionId;

  const reservation = await StockReservation.findOne(query);
  if (!reservation) return;

  await ProductVariant.findByIdAndUpdate(
    variantId,
    { $inc: { reserved: -reservation.quantity } }
  );

  await reservation.deleteOne();
};

// Atomically decrement stock on order creation
exports.decrementOnOrder = async (variantId, quantity, userId, sessionId) => {
  // Release reservation first
  const query = { variantId };
  if (userId) query.userId = userId;
  else if (sessionId) query.sessionId = sessionId;

  const reservation = await StockReservation.findOne(query);

  // Atomically decrement stock and release reserved
  const updated = await ProductVariant.findOneAndUpdate(
    {
      _id: variantId,
      stock: { $gte: quantity },
    },
    {
      $inc: {
        stock: -quantity,
        reserved: reservation ? -reservation.quantity : 0,
      },
    },
    { new: true }
  );

  if (!updated) throw new Error('Insufficient stock — oversell blocked');

  if (reservation) await reservation.deleteOne();

  return updated;
};
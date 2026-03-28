const mongoose = require('mongoose');

const stockReservationSchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
      required: true,
    },
    sessionId: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

stockReservationSchema.index({ variantId: 1 });
stockReservationSchema.index({ userId: 1 });
stockReservationSchema.index({ sessionId: 1 });

module.exports = mongoose.model('StockReservation', stockReservationSchema);
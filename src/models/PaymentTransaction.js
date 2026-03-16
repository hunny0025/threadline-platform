const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },

  provider: {
    type: String,
    enum: ['stripe'],
    required: true
  },

  paymentIntentId: {
    type: String,
    required: true,
    index: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: 'INR'
  },

  status: {
    type: String,
    enum: ['pending','succeeded','failed'],
    default: 'pending'
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);

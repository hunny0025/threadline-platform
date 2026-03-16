const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },

  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant'
  },

  name: String,
  size: String,
  color: String,

  price: Number,
  quantity: Number

});

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [orderItemSchema],

  totalAmount: {
    type: Number,
    required: true
  },

  statusHistory: [
    {
      status: {
        type: String,
        enum: ['placed','paid','shipped','delivered','cancelled']
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]

},
{
  timestamps: true
}
);

module.exports = mongoose.model('Order', orderSchema);

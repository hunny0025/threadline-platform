const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({

  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  }

});

const cartSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },

  sessionId: {
    type: String,
    default: null,
    index: true
  },

  items: [cartItemSchema],

  expiresAt: {
    type: Date,
    index: { expires: '7d' }
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model('Cart', cartSchema);

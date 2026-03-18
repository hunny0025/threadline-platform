import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    
    eventType: {
      type: String,
      enum: ['page_view', 'product_click', 'cart_add'],
      required: true,
      index: true,
    },


    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, 
      index: true,
    },

    
    payload: {
      
      page: { type: String, default: null },        // e.g. "/", "/shop", "/product/abc"
      referrer: { type: String, default: null },

      
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
        index: true,
      },
      productName: { type: String, default: null },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant',
        default: null,
      },
      category: { type: String, default: null },

      
      quantity: { type: Number, default: null },
      price: { type: Number, default: null },
    },

    meta: {
      userAgent: { type: String, default: null },
      ip: { type: String, default: null },
      country: { type: String, default: null },
      device: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'unknown'],
        default: 'unknown',
      },
    },
  },
  {
    timestamps: true, 
    collection: 'analyticsevents',
  }
);


analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ sessionId: 1, createdAt: 1 });
analyticsEventSchema.index({ userId: 1, eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ 'payload.productId': 1, eventType: 1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

export default AnalyticsEvent;

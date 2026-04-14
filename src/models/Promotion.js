const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    imageUrl:    { type: String, trim: true, default: '' },
    linkUrl:     { type: String, trim: true, default: '' },
    position:    { type: String, enum: ['hero', 'banner', 'popup', 'strip'], default: 'banner' },
    startsAt:    { type: Date, required: true },
    endsAt:      { type: Date, required: true },
    isActive:    { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

promotionSchema.index({ isActive: 1, startsAt: 1, endsAt: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);

const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const mongoose = require('mongoose');

exports.filterProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      fitType,
      fabricWeight,
      gender,
      size,
      color,
      inStock,
      page = 1,
      limit = 20
    } = req.body;

    const matchStage = {
      isActive: true
    };

    if (category) matchStage.category = new mongoose.Types.ObjectId(category);
    if (fitType) matchStage.fitType = fitType;
    if (fabricWeight) matchStage.fabricWeight = fabricWeight;
    if (gender) matchStage.gender = gender;

    if (minPrice || maxPrice) {
      matchStage.basePrice = {};
      if (minPrice) matchStage.basePrice.$gte = minPrice;
      if (maxPrice) matchStage.basePrice.$lte = maxPrice;
    }

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants"
        }
      },

      { $unwind: "$variants" }
    ];

    if (size) pipeline.push({ $match: { "variants.size": size } });

    if (color) pipeline.push({ $match: { "variants.color": color } });

    if (inStock) pipeline.push({ $match: { "variants.stock": { $gt: 0 } } });

    pipeline.push(
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          slug: { $first: "$slug" },
          basePrice: { $first: "$basePrice" },
          images: { $first: "$images" },
          variants: { $push: "$variants" }
        }
      },

      { $sort: { createdAt: -1 } },

      { $skip: (page - 1) * limit },

      { $limit: parseInt(limit) }
    );

    const products = await Product.aggregate(pipeline);

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (err) {
    next(err);
  }
};

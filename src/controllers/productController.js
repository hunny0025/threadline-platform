const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');
const { paginate } = require('../utils/pagination');

// GET /products (paginate + filter)
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, gender, fitType, fabricWeight, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (fitType) filter.fitType = fitType;
    if (fabricWeight) filter.fabricWeight = fabricWeight;
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    sendSuccess(res, paginate(products, total, page, limit), 'Products fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// GET /products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return sendError(res, 'Product not found', 404);
    sendSuccess(res, product, 'Product fetched successfully');
  } catch (err) {
    // CastError means the ID format is invalid — return 400 not 500
    if (err.name === 'CastError') return sendError(res, 'Invalid product ID', 400);
    sendError(res, err.message, 500);
  }
};

const { optimizeImage } = require('../utils/imageOptimizer');

// POST /products (admin)
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Handle image uploads and optimization (Task 7)
    if (req.files && req.files.length > 0) {
      const optimizedImages = await Promise.all(
        req.files.map(async (file) => {
          // Optimize each image to WebP (standard)
          const optimizedPath = await optimizeImage(file.path, 'webp', 1000);
          return optimizedPath;
        })
      );
      productData.images = optimizedImages;
    }

    const product = await Product.create(productData);
    sendSuccess(res, product, 'Product created successfully', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// PATCH /products/:id (admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return sendError(res, 'Product not found', 404);
    sendSuccess(res, product, 'Product updated successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// DELETE /products/:id (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return sendError(res, 'Product not found', 404);
    sendSuccess(res, null, 'Product deleted successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// POST /products/filter
// POST /products/filter
exports.filterProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      fitType,
      fabricWeight,
      gender,
      occasion,
      size,
      color,
      page = 1,
      limit = 20,
    } = req.body;

    const matchStage = { isActive: true };
    if (category) {
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return sendError(res, 'Invalid category ID', 400);
      }
      matchStage.category = new mongoose.Types.ObjectId(category);
    }
    if (fitType) matchStage.fitType = fitType;
    if (fabricWeight) matchStage.fabricWeight = fabricWeight;
    if (gender) matchStage.gender = gender;
    if (occasion) matchStage.occasion = occasion;
    if (minPrice || maxPrice) {
      matchStage.basePrice = {};
      if (minPrice) matchStage.basePrice.$gte = Number(minPrice);
      if (maxPrice) matchStage.basePrice.$lte = Number(maxPrice);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'productvariants',
          localField: '_id',
          foreignField: 'product',
          as: 'variants',
        },
      },
    ];

    // Filter by size or color if provided
    if (size || color) {
      const variantMatch = {};
      if (size) variantMatch['variants.size'] = size;
      if (color) variantMatch['variants.color'] = color;
      pipeline.push({ $match: variantMatch });
    }

    // Count total before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await require('../models/Product').aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination and projection
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) },
      {
        $project: {
          name: 1,
          slug: 1,
          basePrice: 1,
          images: 1,
          fitType: 1,
          fabricWeight: 1,
          gender: 1,
          occasion: 1,
          category: 1,
          variants: {
            $map: {
              input: '$variants',
              as: 'v',
              in: {
                size: '$$v.size',
                color: '$$v.color',
                stock: '$$v.stock',
                price: '$$v.price',
                inStock: { $gt: ['$$v.stock', 0] },
              },
            },
          },
        },
      }
    );

    const products = await require('../models/Product').aggregate(pipeline);

    const { paginate } = require('../utils/pagination');
    sendSuccess(res, paginate(products, total, page, limit), 'Products filtered successfully');
  } catch (err) {
    next(err);
  }
};
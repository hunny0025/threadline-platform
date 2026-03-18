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
    sendError(res, err.message, 500);
  }
};

// POST /products (admin)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
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
exports.filterProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, fitType, fabricWeight, gender, page = 1, limit = 20 } = req.body;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (fitType) filter.fitType = fitType;
    if (fabricWeight) filter.fabricWeight = fabricWeight;
    if (gender) filter.gender = gender;
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = minPrice;
      if (maxPrice) filter.basePrice.$lte = maxPrice;
    }
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    sendSuccess(res, paginate(products, total, page, limit), 'Products filtered successfully');
  } catch (err) {
    next(err);
  }
};
const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/response');

// GET /categories (tree)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    sendSuccess(res, categories, 'Categories fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// GET /categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 'Category not found', 404);
    sendSuccess(res, category, 'Category fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// POST /categories (admin)
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    sendSuccess(res, category, 'Category created successfully', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// PATCH /categories/:id (admin)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return sendError(res, 'Category not found', 404);
    sendSuccess(res, category, 'Category updated successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// DELETE /categories/:id (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) return sendError(res, 'Category not found', 404);
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
const ProductVariant = require('../models/ProductVariant');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');

// GET /products/:id/variants
exports.getVariants = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 'Product not found', 404);

    const variants = await ProductVariant.find({ product: req.params.id });

    // Get unique sizes and colors
    const sizes = [...new Set(variants.map(v => v.size))];
    const colors = [...new Set(variants.map(v => v.color))];

    // Build size options with availability
    const sizeOptions = sizes.map(size => {
      const sizeVariants = variants.filter(v => v.size === size);
      const inStock = sizeVariants.some(v => v.stock > 0);
      return { size, inStock, stock: sizeVariants.reduce((acc, v) => acc + v.stock, 0) };
    });

    // Build color options with availability
    const colorOptions = colors.map(color => {
      const colorVariants = variants.filter(v => v.color === color);
      const inStock = colorVariants.some(v => v.stock > 0);
      return { color, inStock, stock: colorVariants.reduce((acc, v) => acc + v.stock, 0) };
    });

    // Build full variant matrix with availability flags
    const variantMatrix = variants.map(v => ({
      id: v._id,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
      inStock: v.stock > 0,
    }));

    sendSuccess(res, {
      productId: req.params.id,
      sizeOptions,
      colorOptions,
      variants: variantMatrix,
    }, 'Variants fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// GET /products/:id/variants/check-stock?size=M&color=black
exports.checkStock = async (req, res) => {
  try {
    const { size, color } = req.query;
    if (!size || !color) return sendError(res, 'size and color are required', 400);

    const variant = await ProductVariant.findOne({
      product: req.params.id,
      size,
      color,
    });

    if (!variant) return sendError(res, 'Variant not found', 404);

    sendSuccess(res, {
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
      inStock: variant.stock > 0,
      price: variant.price,
    }, 'Stock checked successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
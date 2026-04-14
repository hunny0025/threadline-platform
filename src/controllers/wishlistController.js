const User = require('../models/User');
const ProductVariant = require('../models/ProductVariant');
const { sendSuccess, sendError } = require('../utils/response');

// POST /wishlist/add
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id; // FIX: was req.params.userId 

    if (!productId) return sendError(res, 'productId is required', 400);

    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);

    const alreadyAdded = user.wishlist.some(
      (w) => w.product.toString() === productId
    );
    if (alreadyAdded) return sendError(res, 'Product already in wishlist', 409);

    user.wishlist.push({ product: productId });
    await user.save();

    sendSuccess(res, { wishlist: user.wishlist }, 'Added to wishlist', 201);
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid productId', 400);
    sendError(res, err.message, 500);
  }
};

// DELETE /wishlist/remove
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id; // FIX: was req.params.userId 

    if (!productId) return sendError(res, 'productId is required', 400);

    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found', 404);

    user.wishlist = user.wishlist.filter(
      (w) => w.product.toString() !== productId
    );
    await user.save();

    sendSuccess(res, { wishlist: user.wishlist }, 'Removed from wishlist');
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid productId', 400);
    sendError(res, err.message, 500);
  }
};

// GET /wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // FIX: was req.params.userId 

    const user = await User.findById(userId)
      .select('wishlist')
      .populate({
        path: 'wishlist.product',
        select: 'name slug basePrice images isActive',
      });
    if (!user) return sendError(res, 'User not found', 404);

    // Attach live stock status for each wishlist product
    const wishlistWithStock = await Promise.all(
      user.wishlist.map(async (item) => {
        const variants = await ProductVariant.find({
          product: item.product?._id,
        }).select('stock reserved size color');
        const inStock = variants.some(
          (v) => (v.stock - (v.reserved || 0)) > 0
        );
        return { ...item.toObject(), inStock };
      })
    );

    sendSuccess(res, { wishlist: wishlistWithStock }, 'Wishlist fetched');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

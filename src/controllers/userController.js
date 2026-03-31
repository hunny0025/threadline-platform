const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

// GET /users/:id/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email phone avatar createdAt');
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'Profile fetched successfully');
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid user ID', 400);
    sendError(res, err.message, 500);
  }
};

// PATCH /users/:id/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (name && name.length < 2) {
      return sendError(res, 'Name must be at least 2 characters', 400);
    }
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      return sendError(res, 'Invalid phone number', 400);
    }
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (req.file) updates.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('name email phone avatar');

    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'Profile updated successfully');
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid user ID', 400);
    sendError(res, err.message, 500);
  }
};

// GET /users/:id/addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('addresses');
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, { addresses: user.addresses }, 'Addresses fetched successfully');
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid user ID', 400);
    sendError(res, err.message, 500);
  }
};

// POST /users/:id/addresses
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    // If it's their first address, make it the default automatically
    const isFirstAddress = user.addresses.length === 0;
    const newAddress = { ...req.body, isDefault: isFirstAddress };

    user.addresses.push(newAddress);
    await user.save();

    sendSuccess(res, { addresses: user.addresses }, 'Address added successfully', 201);
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid user ID', 400);
    sendError(res, err.message, 500);
  }
};

// PATCH /users/:id/addresses/:addressId/default
exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    let addressFound = false;

    // Loop through and set the matching one to true, all others to false
    user.addresses.forEach(addr => {
      if (addr._id.toString() === req.params.addressId) {
        addr.isDefault = true;
        addressFound = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!addressFound) return sendError(res, 'Address not found', 404);

    await user.save();
    sendSuccess(res, { addresses: user.addresses }, 'Default address updated successfully');
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid user ID', 400);
    sendError(res, err.message, 500);
  }
};

// DELETE /users/:id/addresses/:addressId
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    const addressToDelete = user.addresses.id(req.params.addressId);
    if (!addressToDelete) return sendError(res, 'Address not found', 404);

    // Remove the address
    user.addresses.pull(req.params.addressId);

    // If they deleted their default address, make the first remaining one the new default
    if (addressToDelete.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    sendSuccess(res, { addresses: user.addresses }, 'Address deleted successfully');
  } catch (err) {
    if (err.name === 'CastError') return sendError(res, 'Invalid user ID', 400);
    sendError(res, err.message, 500);
  }
};

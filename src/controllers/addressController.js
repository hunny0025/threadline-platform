const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

// GET /users/:id/addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('addresses');
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user.addresses, 'Addresses fetched successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// POST /users/:id/addresses
exports.addAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    if (!street || !city || !state || !zipCode) {
      return sendError(res, 'Street, city, state and zipCode are required', 400);
    }
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    // If new address is default, unset all others
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ street, city, state, zipCode, country, isDefault });
    await user.save();
    sendSuccess(res, user.addresses, 'Address added successfully', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// PATCH /users/:id/addresses/:addressId
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    const address = user.addresses.id(req.params.addressId);
    if (!address) return sendError(res, 'Address not found', 404);

    const { street, city, state, zipCode, country, isDefault } = req.body;

    // If updating to default, unset all others
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();
    sendSuccess(res, user.addresses, 'Address updated successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// DELETE /users/:id/addresses/:addressId
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    const address = user.addresses.id(req.params.addressId);
    if (!address) return sendError(res, 'Address not found', 404);

    address.deleteOne();
    await user.save();
    sendSuccess(res, user.addresses, 'Address deleted successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

// PATCH /users/:id/addresses/:addressId/set-default
exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    const address = user.addresses.id(req.params.addressId);
    if (!address) return sendError(res, 'Address not found', 404);

    // Unset all defaults first
    user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;

    await user.save();
    sendSuccess(res, user.addresses, 'Default address set successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};
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
    sendError(res, err.message, 500);
  }
};
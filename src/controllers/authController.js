const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

const getJwtSecret = () => process.env.JWT_SECRET || 'test_jwt_secret_fallback';
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_fallback';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    getJwtSecret(),
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    getRefreshSecret(),
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 'Name, email and password are required', 400);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'Email already registered', 400);
    }
    const user = new User({ name, email, password });
    await user.save();
    sendSuccess(res, { id: user._id, name: user.name, email: user.email }, 'User registered successfully', 201);
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Invalid email or password', 401);
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendSuccess(res, { accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return sendError(res, 'No refresh token', 401);
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, 'User not found', 401);
    const accessToken = generateAccessToken(user);
    sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch (err) {
    sendError(res, 'Invalid refresh token', 401);
  }
};

const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Logged out successfully');
};

module.exports = { register, login, refresh, logout };
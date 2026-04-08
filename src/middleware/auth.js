const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { sendError } = require('../utils/response');

const getSecret = () => jwtSecret || 'test_jwt_secret_fallback';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 'Authorization token required', 401);
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, getSecret());
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
};
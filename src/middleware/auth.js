const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const getSecret = () => jwtSecret || 'test_jwt_secret_fallback';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, getSecret());
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
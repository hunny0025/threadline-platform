const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const getJwtSecret = () => process.env.JWT_SECRET || 'test_jwt_secret_fallback';

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, getJwtSecret());
    } catch {
      req.user = null;
    }
  }
  next();
};

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  mergeCart,
} = require('../controllers/cartController');

router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, addToCart);
router.patch('/update', optionalAuth, updateCart);
router.delete('/remove', optionalAuth, removeFromCart);
router.post('/merge', auth, mergeCart);

module.exports = router;
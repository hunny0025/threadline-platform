const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
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
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, config.jwtSecret);
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
const { validate } = require('../middleware/validation');

// Validation rules
const variantIdValidation = [
  body('variantId').isMongoId().withMessage('Valid variant ID required'),
];
const quantityValidation = [
  body('quantity')
    .optional()
    .isInt({ min: 0, max: 99 }) // ✅ allow 0
    .withMessage('Quantity must be 0-99'),
];

router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, variantIdValidation, validate, addToCart);
router.patch('/update', optionalAuth, [...variantIdValidation, ...quantityValidation], validate, updateCart);
router.delete('/remove', optionalAuth, variantIdValidation, validate, removeFromCart);
router.post('/merge', auth, body('sessionId').notEmpty().withMessage('sessionId required'), validate, mergeCart);

module.exports = router;
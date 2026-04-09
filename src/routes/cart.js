const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 🔥 FIXED optionalAuth (IMPORTANT)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, config.jwtSecret);
    }
  } catch (err) {
    req.user = null; // NEVER break request
  }

  next(); // ALWAYS continue
};

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  mergeCart,
} = require('../controllers/cartController');

const { validate } = require('../middleware/validation');

// ✅ SIMPLE validation (NO MongoId strict check)
const variantIdValidation = [
  body('variantId')
    .notEmpty()
    .withMessage('variantId is required'),
];

const quantityValidation = [
  body('quantity')
    .optional()
    .isInt({ min: 0, max: 99 }) // ✅ allow 0
    .withMessage('Quantity must be 0-99'),
];

// ✅ NO validation on GET
router.get('/', optionalAuth, getCart);

// ✅ Apply validation only where needed
router.post('/add', optionalAuth, variantIdValidation, validate, addToCart);

router.patch(
  '/update',
  optionalAuth,
  [...variantIdValidation, ...quantityValidation],
  validate,
  updateCart
);

router.delete('/remove', optionalAuth, variantIdValidation, validate, removeFromCart);

// merge needs auth
const auth = require('../middleware/auth');
router.post(
  '/merge',
  auth,
  body('sessionId').notEmpty().withMessage('sessionId required'),
  validate,
  mergeCart
);

module.exports = router;
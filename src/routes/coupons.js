const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  validateCoupon,
  applyCoupon,
  createCoupon,
  listCoupons,
  deactivateCoupon,
} = require('../controllers/couponController');

// User routes
router.post('/validate', auth, validateCoupon);
router.post('/apply',    auth, applyCoupon);

// Admin routes
router.post('/', auth, rbac('admin'), createCoupon);
router.get('/', auth, rbac('admin'), listCoupons);
router.delete('/:id', auth, rbac('admin'), deactivateCoupon);

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} = require('../controllers/promotionController');

// Public — frontend fetches active banners
router.get('/', getActivePromotions);

// Admin only
router.post('/',       auth, rbac('admin'), createPromotion);
router.patch('/:id',   auth, rbac('admin'), updatePromotion);
router.delete('/:id',  auth, rbac('admin'), deletePromotion);

module.exports = router;

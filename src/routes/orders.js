const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { validate } = require('../middleware/validation');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  adminGetOrders,   // ← NEW
} = require('../controllers/orderController');

const orderIdValidation = [param('id').isMongoId().withMessage('Valid order ID required')];
const statusValidation  = [body('status').notEmpty().withMessage('Status is required')];

// User routes
router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, orderIdValidation, validate, getOrderById);
router.post('/:id/cancel', auth, orderIdValidation, validate, cancelOrder);

// Admin routes
router.patch('/:id/status', auth, rbac('admin'), [...orderIdValidation, ...statusValidation], validate, updateOrderStatus);
router.get('/admin/all', auth, rbac('admin'), adminGetOrders);  // ← NEW (supports ?exportCsv=true)

module.exports = router;

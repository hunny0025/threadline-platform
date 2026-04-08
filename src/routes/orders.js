const express = require('express');
const router = express.Router();
const { param, body, query } = require('express-validator');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { validate } = require('../middleware/validation');

// Validation rules
const orderIdValidation = [
  param('id').isMongoId().withMessage('Valid order ID required'),
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
];

const statusValidation = [
  body('status').isIn(['placed', 'paid', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
];

router.post('/', auth, createOrder);
router.get('/', auth, paginationValidation, validate, getOrders);
router.get('/:id', auth, orderIdValidation, validate, getOrderById);
router.patch('/:id/status', auth, rbac('admin'), [...orderIdValidation, ...statusValidation], validate, updateOrderStatus);
router.post('/:id/cancel', auth, orderIdValidation, validate, cancelOrder);

module.exports = router;
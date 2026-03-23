const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// GET /orders
router.get('/', auth, (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Get all orders',
    data: [],
  });
});

// POST /orders
router.post('/', auth, (req, res) => {
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Order created',
    data: null,
  });
});

// GET /orders/:id
router.get('/:id', auth, (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    message: `Get order ${req.params.id}`,
    data: null,
  });
});

// PATCH /orders/:id
router.patch('/:id', auth, (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    message: `Update order ${req.params.id}`,
    data: null,
  });
});

// DELETE /orders/:id (admin)
router.delete('/:id', auth, rbac('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    message: `Delete order ${req.params.id}`,
    data: null,
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const {
  createIntent,
  confirmPayment,
  webhook,
  refund,
} = require('../controllers/paymentController');

router.post('/create-intent', auth, createIntent);
router.post('/confirm', auth, confirmPayment);
router.post('/webhook', webhook);
router.post('/refund', auth, rbac('admin'), refund);

module.exports = router;
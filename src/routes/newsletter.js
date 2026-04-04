const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const rateLimit = require('express-rate-limit');
const { subscribe } = require('../controllers/newsletterController');
const { getSubscribers, removeSubscriber } = require('../controllers/adminNewsletterController');

// Strict rate limit for newsletter — max 5 attempts per 15 mins per IP
const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    status: 429,
    message: 'Too many subscription attempts. Please try again later.',
    data: null
  }
});

// Public
router.post('/subscribe', newsletterLimiter, subscribe);

// Admin only
router.get('/admin/subscribers', auth, rbac('admin'), getSubscribers);
router.delete('/admin/subscribers/:email', auth, rbac('admin'), removeSubscriber);

module.exports = router;

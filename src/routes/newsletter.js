const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { subscribe } = require('../controllers/newsletterController');

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

router.post('/subscribe', newsletterLimiter, subscribe);

module.exports = router;
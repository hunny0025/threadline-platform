const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/newsletterController');

// POST /api/v1/newsletter/subscribe
router.post('/subscribe', subscribe);

module.exports = router;
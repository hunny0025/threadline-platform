const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { subscribe } = require('../controllers/newsletterController');
const { getSubscribers, removeSubscriber } = require('../controllers/adminNewsletterController');

// Public
router.post('/subscribe', subscribe);

// Admin only
router.get('/admin/subscribers', auth, rbac('admin'), getSubscribers);
router.delete('/admin/subscribers/:email', auth, rbac('admin'), removeSubscriber);

module.exports = router;

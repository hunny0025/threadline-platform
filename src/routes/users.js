const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProfile, updateProfile } = require('../controllers/userController');

// Profile routes
router.get('/:id/profile', auth, getProfile);
router.patch('/:id/profile', auth, upload.single('avatar'), updateProfile);

// Addresses
router.use('/:id/addresses', require('./addresses'));

module.exports = router;
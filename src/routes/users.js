const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProfile, updateProfile } = require('../controllers/userController');

// GET /users/:id/profile
router.get('/:id/profile', auth, getProfile);

// PATCH /users/:id/profile
router.patch('/:id/profile', auth, upload.single('avatar'), updateProfile);

module.exports = router;
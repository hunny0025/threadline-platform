const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProfile, updateProfile } = require('../controllers/userController');

router.post('/register', (req, res) => {
  res.json({ message: 'User registered' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'User logged in' });
});

router.get('/:id/profile', auth, getProfile);
router.patch('/:id/profile', auth, upload.single('avatar'), updateProfile);

module.exports = router;
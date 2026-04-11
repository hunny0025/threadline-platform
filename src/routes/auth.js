const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { register, login, refresh, logout } = require('../controllers/authController');
const { authLimiter } = require('../middleware/authRateLimiter');
const { validate } = require('../middleware/validation');

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

const crypto = require('crypto');
const redis = require('../db/redis');

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    const accessToken = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const code = crypto.randomUUID();
    await redis.setEx(`oauth_code:${code}`, 60, accessToken);
    const origin = process.env.ALLOWED_ORIGINS.split(',')[0];
    res.redirect(`${origin}/auth/callback?code=${code}`);
  }
);

module.exports = router;
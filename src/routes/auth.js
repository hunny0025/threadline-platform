const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { register, login, refresh, logout, getMe } = require('../controllers/authController');
const { authLimiter } = require('../middleware/authRateLimiter');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/authMiddleware');

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
router.get('/me', protect, getMe);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      const accessToken = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      const refreshToken = jwt.sign(
        { id: req.user._id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect directly to frontend with tokens — no Redis needed
      const origin = (process.env.ALLOWED_ORIGINS || '').split(',')[0].trim().replace(/\/$/, '')
        || 'https://threadline-platform.vercel.app';

      return res.redirect(
        `${origin}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (err) {
      console.error('Google OAuth callback error:', err.message);
      return res.redirect('/login?error=oauth_failed');
    }
  }
);

module.exports = router;
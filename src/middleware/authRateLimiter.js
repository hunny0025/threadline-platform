const rateLimit = require('express-rate-limit');

const isTestEnv = process.env.NODE_ENV === 'test' || process.env.SKIP_RATE_LIMIT === '1';

const authLimiter = isTestEnv
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      message: { error: 'Too many attempts, please try again in 15 minutes.' },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true,
    });

const passwordResetLimiter = isTestEnv
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 3,
      message: { error: 'Too many reset attempts, please try again in 1 hour.' },
      standardHeaders: true,
      legacyHeaders: false,
    });

module.exports = { authLimiter, passwordResetLimiter };
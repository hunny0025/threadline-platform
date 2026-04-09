const rateLimit = require('express-rate-limit');

const isTestEnv = process.env.NODE_ENV === 'test' || process.env.SKIP_RATE_LIMIT === '1';
const loadTestMode = process.env.LOAD_TEST === '1';

if (isTestEnv || loadTestMode) {
  console.log(`[rate-limiter] SKIPPED (${loadTestMode ? 'load-test' : 'test'} mode)`);
}

// Higher limits for load testing: 5000 req/min instead of 100 req/15min
const maxRequests = loadTestMode ? 5000 : (process.env.RATE_LIMIT_MAX || 100);
const windowMs = loadTestMode ? 60 * 1000 : (15 * 60 * 1000); // 1 min for load test, 15 min default

module.exports = (isTestEnv || loadTestMode)
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs,
      max: maxRequests,
      message: { error: 'Too many requests, please try again later.' },
      standardHeaders: true,
      legacyHeaders: false,
    });
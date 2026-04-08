require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  // Secrets - must be set in environment
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  mongoUri: process.env.MONGODB_URI,
  redisUrl: process.env.REDIS_URL,
  sentryDsn: process.env.SENTRY_DSN,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  sessionSecret: process.env.SESSION_SECRET,
};
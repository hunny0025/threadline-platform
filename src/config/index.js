// ============================================================
// Threadline Platform - Central Configuration
// Loads environment variables from .env file using dotenv.
// All environment-specific settings should be managed here.
// See .env.example for a list of required environment variables.
// ============================================================

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/threadline',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
};
// ============================================================
// Threadline Platform - Server Entry Point
// Connects to MongoDB first, then starts the Express server.
// This is the main file that Railway will run via `npm start`.
// ============================================================

// Optional: New Relic APM — set NEW_RELIC_LICENSE_KEY env var to activate
try {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
  }
} catch (_) { /* newrelic not installed — skip silently */ }

const app = require('./src/app');
const config = require('./src/config');
const { port, sentryDsn, nodeEnv } = config;
const connectDB = require('./src/db/mongoose');
const logger = require('./src/utils/logger');
const mongoose = require('mongoose');
const redis = require('./src/db/redis');
const Sentry = require('@sentry/node');

// Sentry Monitoring (Task 8)
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: nodeEnv,
    integrations: [],
    tracesSampleRate: 1.0,
  });
  logger.info('🛰️ Sentry initialized successfully');
}

let server;

// Graceful shutdown — closes HTTP server, DB, cache before exiting
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    try {
      await mongoose.disconnect();
      redis.disconnect();
      logger.info('All connections closed. Exiting.');
    } catch (err) {
      logger.error('Error during shutdown:', err.message);
    } finally {
      process.exit(0);
    }
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Forced exit after timeout');
    process.exit(1);
  }, 10000).unref();
};

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(port, () => {
      logger.info(`🚀 Threadline API running on http://localhost:${port}`);
      logger.info(`📄 Swagger docs at http://localhost:${port}/api/docs`);
    });

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
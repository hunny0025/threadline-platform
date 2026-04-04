const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const corsMiddleware = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const morgan = require('morgan');
const logger = require('./utils/logger');
const Sentry = require('@sentry/node');
const config = require('./config');

const app = express();

// Sentry Request Logging (Task 8)
if (config.sentryDsn) {
  // @sentry/node v8+ auto-instruments Express if initialized in server.js
  // No explicit requestHandler needed in most cases, but we can add more here.
}

// Request logging (Task 8)
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Trust proxy for secure cookies (Railway/Vercel)
app.set('trust proxy', 1);

// ── Security Headers (Task 4) ────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], // Common image sources
      connectSrc: ["'self'", "https://api.stripe.com"], // For payments
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Force HTTPS (Task 4)
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.originalUrl}`);
    }
    next();
  });
}

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

// Session for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
}));

// Passport
app.use(passport.initialize());

// Swagger docs
const swaggerDoc = YAML.load(path.join(__dirname, 'docs/swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use('/api/v1', routes);

const mongoose = require('mongoose');
const redis = require('./db/redis');

// Health check (Task 8 & 9)
app.get('/health', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  let redisStatus = 'disconnected';
  if (redis) {
    try {
      await redis.ping();
      redisStatus = 'connected';
    } catch {
      redisStatus = 'disconnected';
    }
  }

  const status = mongoStatus === 'connected' && redisStatus === 'connected' ? 'OK' : 'DEGRADED';
  
  res.status(status === 'OK' ? 200 : 503).json({
    status,
    project: 'Threadline API',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoStatus,
      redis: redisStatus,
    },
  });
});

// Finalize Sentry if DSN is present (Task 8)
if (config.sentryDsn) {
  Sentry.setupExpressErrorHandler(app);
}

// Error handler
app.use(errorHandler);

module.exports = app;
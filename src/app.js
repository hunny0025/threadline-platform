const express = require('express');
const helmet = require('helmet');
const corsMiddleware = require('./middleware/cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(rateLimiter);

// Swagger docs
const swaggerDoc = YAML.load(path.join(__dirname, 'docs/swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', project: 'Threadline API' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
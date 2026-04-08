const logger = require('../utils/logger');
const config = require('../config');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = config.isProduction && status === 500 ? 'Internal Server Error' : err.message;

  logger.error(`${status} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: config.isProduction ? undefined : err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  res.status(status).json({
    success: false,
    status,
    message,
    data: null,
  });
};
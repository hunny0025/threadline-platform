const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { stack: err.stack });
  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
    data: null,
  });
};
const config = require('../config');

const isProduction = config.isProduction;

const formatLog = (level, message, meta = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  return JSON.stringify(logEntry);
};

const logger = {
  info: (msg, meta) => {
    if (isProduction) {
      console.log(formatLog('info', msg, meta));
    } else {
      console.log(`[INFO] ${msg}`, meta || '');
    }
  },
  error: (msg, meta) => {
    if (isProduction) {
      console.error(formatLog('error', msg, meta));
    } else {
      console.error(`[ERROR] ${msg}`, meta || '');
    }
  },
  warn: (msg, meta) => {
    if (isProduction) {
      console.warn(formatLog('warn', msg, meta));
    } else {
      console.warn(`[WARN] ${msg}`, meta || '');
    }
  },
  debug: (msg, meta) => {
    if (!isProduction) {
      console.log(`[DEBUG] ${msg}`, meta || '');
    }
  },
};

module.exports = logger;
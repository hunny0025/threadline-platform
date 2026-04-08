const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return sendError(res, `${firstError.path}: ${firstError.msg}`, 400);
  }
  next();
};

module.exports = { validate };
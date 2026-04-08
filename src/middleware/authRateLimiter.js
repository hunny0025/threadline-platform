const authLimiter = (req, res, next) => next();
const passwordResetLimiter = (req, res, next) => next();

module.exports = {
  authLimiter,
  passwordResetLimiter,
};
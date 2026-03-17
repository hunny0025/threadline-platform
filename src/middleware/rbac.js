const rbac = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Unauthorized - Please login',
        data: null,
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Forbidden - You do not have permission',
        data: null,
      });
    }
    next();
  };
};

module.exports = rbac;
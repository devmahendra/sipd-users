const { hasPermission } = require('./permission');
const { logData } = require('./loggers');
const defaultResponse = require('./responseDefault');

/**
 * Reusable permission checker
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {string} permissionType - 'r', 'w', 'd', etc.
 * @returns {boolean} - true if permitted, false if denied (response sent)
 */
const checkPermission = (req, res, permissionType) => {
  const { user, menuId, routeConfig } = req;
  const processName = routeConfig?.name || 'unknown';
  let httpCode = 403;
  
  if (!hasPermission(user, menuId, permissionType)) {
    const message = `Permission denied for user ${user?.id || 'unknown'}`;
    logData({
      level: 'warn',
      proccessName: processName,
      data: message,
      httpCode: httpCode,
    });
    res.status(httpCode).json(defaultResponse("FORBIDDEN", null, req));
    return false;
  }

  return true;
};

module.exports = checkPermission;

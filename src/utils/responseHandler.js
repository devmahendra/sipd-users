const mapHttpCode = require('../helpers/mapHttpCode'); 
const responseDefault = require('../utils/responseDefault');
const { logData } = require('../utils/loggers'); 

/**
 * Sends a standardized success response
 * @param {Object} res - Express response object
 * @param {Object} req - Express request object
 * @param {Number} httpCode - HTTP status code (default: 200)
 * @param {any} message - Response message or data
 */
const handleSuccess = (res, req, httpCode = 200, message = "Success") => {
  const responseType = mapHttpCode(httpCode);

  logData({
    level: 'debug',
    proccessName: req.routeConfig?.name || 'Unknown Process',
    data: `Success: ${typeof message === 'string' ? message : 'Request processed successfully'}`,
    httpCode,
  });

  res.status(httpCode).json(responseDefault(responseType, message, req));
};

module.exports = { handleSuccess };

const mapHttpCode = require('../helpers/mapHttpCode'); 
const responseDefault = require('../utils/responseDefault'); 
const { logData } = require('../utils/loggers');

/**
 * Custom error class with HTTP status support.
 */
class HttpError extends Error {
  constructor(message, httpCode = 500) {
    super(message);
    this.name = 'HttpError';
    this.httpCode = httpCode;
  }
}

/**
 * Handles errors consistently in all route handlers.
 * @param {Object} res - Express response object
 * @param {Object} req - Express request object
 * @param {Error} error - The error object thrown
 */
const handleError = (res, req, error) => {
  const httpCode = error.httpCode || 500;
  const responseType = mapHttpCode(httpCode);
  
  logData({
    level: 'error',
    proccessName: req.routeConfig?.name || 'Unknown Process',
    data: `Error: ${error.message}`,
    httpCode: httpCode,
  });
  
  res.status(httpCode).json(responseDefault(responseType, error.message, req));
};


module.exports = { handleError, HttpError };

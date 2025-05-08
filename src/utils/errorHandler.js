const mapHttpCode = require('../helpers/mapHttpCode'); 
const responseDefault = require('../utils/responseDefault'); 

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
  res.status(httpCode).json(responseDefault(responseType, error.message, req));
};

module.exports = { handleError, HttpError };

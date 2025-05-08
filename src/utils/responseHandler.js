const mapHttpCode = require('../helpers/mapHttpCode'); 
const responseDefault = require('../utils/responseDefault'); 

/**
 * Sends a standardized success response
 * @param {Object} res - Express response object
 * @param {Object} req - Express request object
 * @param {Number} httpCode - HTTP status code (default: 200)
 * @param {any} message - Response message or data
 */
const handleSuccess = (res, req, httpCode = 200, message = "Success") => {
  const responseType = mapHttpCode(httpCode);
  res.status(httpCode).json(responseDefault(responseType, message, req));
};

module.exports = { handleSuccess };

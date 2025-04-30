const defaultResponse = require("../utils/responseDefault");
const { logData } = require('../utils/logger');

const validateRequest = (route) => (req, res, next) => {
  let processName = 'VALIDATE_REQUEST'
  try {
    req.serviceCode = route.id;

    if (route.validation) {
      const { error, value } = route.validation.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((err) => err.message);
        logData({
          level: 'warn',
          proccessName: processName,
          signal: 'E',
          reason: 'VALIDATION_ERROR ' + errors,
          statusCode: 400,
        });

        return res.status(400).json(defaultResponse('VALIDATION_ERROR', { errors }, req));
      }
      logData({ proccessName: processName, statusCode: 200 });
      req.body = value;
    }
 
    next();
  } catch (error) {
    logData({
      level: 'error',
      proccessName: processName,
      signal: 'E',
      reason: 'INTERNAL_ERROR ' + error.message,
      statusCode: 500,
    });

    return res.status(500).json(defaultResponse('INTERNAL_ERROR', { error: error.message }, req));
  }
};

module.exports = validateRequest;

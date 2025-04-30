const defaultResponse = require("../utils/responseDefault");
const { logData } = require('../utils/logger');

const validateRequest = (route) => (req, res, next) => {
  let processName = 'VALIDATE_REQUEST'
  try {
    req.serviceCode = route.id;

    if (route.validation) {
      const { error, value } = route.validation.validate(req.body, { abortEarly: false });

      if (error) {
        let httpCode = 400;

        const errors = error.details.map((err) => err.message);
        logData({
          proccessName: processName,
          reason: 'VALIDATION_ERROR ' + errors,
          statusCode: httpCode,
        });

        return res.status(httpCode).json(defaultResponse('VALIDATION_ERROR', { errors }, req));
      }
      logData({ proccessName: processName, statusCode: 200 });
      req.body = value;
    }
 
    next();
  } catch (error) {
    let httpCode = 500;

    logData({
      proccessName: processName,
      reason: 'INTERNAL_ERROR ' + error.message,
      statusCode: httpCode,
    });

    return res.status(httpCode).json(defaultResponse('INTERNAL_ERROR', { error: error.message }, req));
  }
};

module.exports = validateRequest;

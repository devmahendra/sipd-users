const defaultResponse = require("../utils/responseDefault");
const { logData } = require('../utils/loggers');

const validateRequest = (route) => (req, res, next) => {
  const processName = 'VALIDATE_REQUEST';
  req.serviceCode = route.id;

  try {
    if (!route.validation) return next();

    // Support different validation sources
    const sources = ['body', 'query', 'params'];
    for (const source of sources) {
      if (route.validation[source]) {
        const { error, value } = route.validation[source].validate(req[source], { abortEarly: false });
        if (error) {
          const httpCode = 400;
          const errors = error.details.map((err) => err.message);
          logData({
            proccessName: processName,
            data: `VALIDATION_ERROR (${source}) ` + errors,
            httpCode,
          });
          return res.status(httpCode).json(defaultResponse('VALIDATION_ERROR', { errors }, req));
        }
        req[source] = value;
      }
    }

    logData({
      proccessName: processName,
      data: 'Request validated successfully',
      httpCode: 200,
    });
    next();

  } catch (error) {
    const httpCode = 500;
    logData({
      proccessName: processName,
      data: 'INTERNAL_ERROR ' + error.message,
      httpCode,
    });
    return res.status(httpCode).json(defaultResponse('INTERNAL_ERROR', { error: error.message }, req));
  }
};

module.exports = validateRequest;

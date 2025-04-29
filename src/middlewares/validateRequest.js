const defaultResponse = require("../utils/responseDefault");
const logger = require("../utils/logger"); // import your logger

const validateRequest = (route) => (req, res, next) => {
  let processName = 'VALIDATE_REQUEST'
  try {
    req.serviceCode = route.id;

    if (route.validation) {
      const { error, value } = route.validation.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((err) => err.message);

        // ✅ Log validation failure
        logger.logData({
          level: 'warn',
          proccessName: processName,
          proccessMessage: { errors }
        });

        return res.status(400).json(defaultResponse('VALIDATION_ERROR', { errors }, req));
      }

      // ✅ Log validation success
      logger.logData({
        level: 'info',
        proccessName: processName,
        proccessMessage: ''
      });

      req.body = value;
    }

    next();
  } catch (error) {
    // ✅ Log unexpected error
    logger.logData({
      level: 'error',
      proccessName: processName,
      proccessMessage: error.message
    });

    return res.status(500).json(defaultResponse('INTERNAL_ERROR', { error: error.message }, req));
  }
};

module.exports = validateRequest;

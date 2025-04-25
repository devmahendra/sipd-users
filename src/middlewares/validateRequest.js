const defaultResponse = require("../utils/responseDefault");

const validateRequest = (route) => (req, res, next) => {
  try {
    req.serviceCode = route.id;

    if (route.validation) {
      const { error, value } = route.validation.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json(defaultResponse("VALIDATION_ERROR", { errors }, req));
      }

      req.body = value;
    }

    next();
  } catch (error) {
    console.error("Error in validate request:", error.message);
    return res.status(500).json(defaultResponse("INTERNAL_ERROR", { error: error.message }, req));
  }
};

module.exports = validateRequest;

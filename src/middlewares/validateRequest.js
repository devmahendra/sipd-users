const defaultResponse = require("../utils/responseDefault");

const validateRequest = (routeConfigs) => (req, res, next) => {
  try {
    const matchedRoute = routeConfigs.find(
      (route) => route.path === req.route.path && route.method.toUpperCase() === req.method
    );

    if (!matchedRoute) {
      return res.status(400).json(defaultResponse("INVALID_ROUTE", {}, req));
    }

    req.serviceCode = matchedRoute.id;

    if (matchedRoute.validation) {
      const { error, value } = matchedRoute.validation.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((err) => err.message);

        return res.status(400).json(
          defaultResponse("VALIDATION_ERROR", { errors }, req)
        );
      }

      req.body = value;
    }

    next();
  } catch (error) {
    console.error("Error in validate request:", error.message);
    return res.status(500).json(
      defaultResponse("INTERNAL_ERROR", { error: error.message }, req)
    );
  }
};

module.exports = validateRequest;

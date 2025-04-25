const responseCodes = {
    SUCCESS: {
      CODE: "00",
      HTTP_CODE: 200,
      MESSAGE: "Request successfully",
      STATUS: "Success",
    },
    MISSING_FIELDS: {
      CODE: "40",
      HTTP_CODE: 400,
      MESSAGE: "Invalid request parameters",
      STATUS: "Error",
    },
    UNAUTHORIZED: {
      CODE: "40",
      HTTP_CODE: 401,
      MESSAGE: "Unauthorized",
      STATUS: "Error",
    },
    FORBIDDEN: {
      CODE: "40",
      HTTP_CODE: 403,
      MESSAGE: "Forbidden Access",
      STATUS: "Error",
    },
    VALIDATION_ERROR: {
      CODE: "40",
      HTTP_CODE: 401,
      MESSAGE: "Invalid request parameters",
      STATUS: "Error",
    },
    INVALID_ROUTE: {
      CODE: "96",
      HTTP_CODE: 500,
      MESSAGE: "Invalid Route",
      STATUS: "Error",
    },
    INTERNAL_ERROR: {
      CODE: "96",
      HTTP_CODE: 500,
      MESSAGE: "Internal server error",
      STATUS: "Error",
    },
  };
  
  module.exports = responseCodes;
  
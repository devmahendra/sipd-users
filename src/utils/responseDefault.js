const responseCodes = require("../constants/responseCode");

const responseDefault = (responseType, data = null, req = null) => {
  const response = responseCodes[responseType];

  if (!response) {
    throw new Error(`Invalid response type: ${responseType}`);
  }

  const serviceCode = req?.serviceCode ? String(req.serviceCode).padStart(2, "0") : "00";

  const responseCode = `${response.HTTP_CODE}${serviceCode}${response.CODE}`;

  const result = {
    responseCode,
    responseMessage: response.MESSAGE,
  };

  if (data !== null && data !== undefined && data !== '') {
    result.responseData = data;
  }

  return result;
};

module.exports = responseDefault;


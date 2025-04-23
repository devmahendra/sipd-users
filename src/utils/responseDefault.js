const responseCodes = require("./responseCode");

const responseDefault = (responseType, data = null, req = null) => {
  const response = responseCodes[responseType];

  if (!response) {
    throw new Error(`Invalid response type: ${responseType}`);
  }

  const serviceCode = req?.serviceCode ? req.serviceCode.padStart(2, "0") : "00";

  const responseCode = `${response.HTTP_CODE}${serviceCode}${response.CODE}`;

  return {
    responseCode,
    responseMessage: response.MESSAGE,
    responseStatus: response.STATUS,
    responseData: data,
  };
};

module.exports = responseDefault;

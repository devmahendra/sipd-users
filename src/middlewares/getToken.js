const jwt = require('jsonwebtoken');
const { redisClient } = require('../configs/redis');
const responseDefault = require('../utils/responseDefault');
const { logData } = require('../utils/loggers');

const getRequestToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  let processName = 'VALIDATE_TOKEN'

  if (!token) {
    let httpCode = 400;

    logData({
      proccessName: processName,
      statusCode: httpCode,
    });
    return res.status(httpCode).json(responseDefault('MISSING_FIELDS', 'Token not found', req));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sessionData = await redisClient.get(decoded.jti);

    if (!sessionData) {
      let httpCode = 401;

      logData({
        proccessName: processName,
        statusCode: httpCode,
      });
      return res.status(httpCode).json(responseDefault('UNAUTHORIZED', 'Unauthorized', req));
    }

    req.user = JSON.parse(sessionData);

    next();
  } catch (error) {
    let httpCode = 500;

    logData({
      proccessName: processName,
      reason: 'INTERNAL_ERROR ' + error.message,
      statusCode: httpCode,
    });
    res.status(httpCode).json(responseDefault('INTERNAL_ERROR', null, req));
  }
};

module.exports = getRequestToken;
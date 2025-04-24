const jwt = require('jsonwebtoken');
const redisClient = require('../configs/redis');
const responseDefault = require('../utils/responseDefault');

const getRequestToken = async (req, res, next) => {
  const token = req.cookies.accessToken; 

  if (!token) {
    const response = responseDefault('MISSING_FIELDS', null, req);
    return res.status(response.HTTP_CODE).json(response);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sessionData = await redisClient.get(decoded.jti);

    if (!sessionData) {
      const response = responseDefault('UNAUTHORIZED', null, req);
      return res.status(response.HTTP_CODE).json(response);
    }
    
    req.user = JSON.parse(sessionData); 
    next();
  } catch (err) {
    const response = responseDefault('INTERNAL_ERROR', null, req);
    return res.status(response.HTTP_CODE).json(response);
  }
};

module.exports = getRequestToken;

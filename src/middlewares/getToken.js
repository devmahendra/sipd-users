const jwt = require('jsonwebtoken');
const { redisClient } = require('../configs/redis');
const responseDefault = require('../utils/responseDefault');

const getRequestToken = async (req, res, next) => {
  const token = req.cookies.accessToken; 

  if (!token) {
    return res.status(400).json(responseDefault("MISSING_FIELDS", null, req));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sessionData = await redisClient.get(decoded.jti);

    if (!sessionData) {
      return res.status(401).json(responseDefault("UNAUTHORIZED", null, req));
    }
    
    req.user = JSON.parse(sessionData); 
    next();
  } catch (err) {
    res.status(500).json(responseDefault("INTERNAL_ERROR", null, req));
  }
};

module.exports = getRequestToken;

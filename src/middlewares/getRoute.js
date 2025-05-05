const { redisClient } = require("../configs/redis"); 
const { getRoutes } = require("../repositories/sysRepository");
const { logData } = require('../utils/loggers');

module.exports = async function getRouteConfigs() {
    const ROUTES_CACHE_KEY = "cached:routes";
    let proccessName = 'GET_ROUTES';
  
    try {
      const cached = await redisClient.get(ROUTES_CACHE_KEY);
  
      if (cached && cached !== '[]') {
        logData({
          level: 'info',
          proccessName: proccessName,
          data: 'Routes retrieved from Redis',
        });
        return JSON.parse(cached);
      }
    } catch (err) {
      logData({
        level: 'warn',
        proccessName: proccessName,
        data: (`Redis get failed, fallback to DB:`, err.message)
      });
    }
  
    try {
      const rows = await getRoutes();
  
      if (rows.length > 0) {
        try {
          await redisClient.set(ROUTES_CACHE_KEY, JSON.stringify(rows), {
            EX: 3600
          });
          logData({
            level: 'info',
            proccessName: proccessName,
            data: 'Routes cached to Redis',
          });
        } catch (err) {
          logData({
            level: 'warn',
            proccessName: proccessName,
            data: (`Redis set failed:`, err.message)
          });
        }
      }
  
      return rows;
    } catch (err) {
      logData({
        level: 'error',
        proccessName: proccessName,
        data: (`DB query failed:`, err.message)
      });
      return []; 
    }
  };
  

const { redisClient } = require("../configs/redis");
const { getRoutes } = require("../repositories/sysRepository");
const { logData } = require('../utils/loggers');

module.exports = async function getRouteConfigs() {
  const ROUTES_CACHE_KEY = "cached:routes";
  const proccessName = 'GET_ROUTES';

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    try {
      await redisClient.del(ROUTES_CACHE_KEY);
      logData({
        level: 'info',
        proccessName,
        data: 'Development mode: route cache cleared',
      });
    } catch (err) {
      logData({
        level: 'warn',
        proccessName,
        data: `Failed to clear Redis cache in development: ${err.message}`
      });
    }
  }

  try {
    const cached = await redisClient.get(ROUTES_CACHE_KEY);

    if (cached && cached !== '[]') {
      logData({
        level: 'info',
        proccessName,
        data: 'Routes retrieved from Redis',
      });
      return JSON.parse(cached);
    }
  } catch (err) {
    logData({
      level: 'warn',
      proccessName,
      data: `Redis get failed, fallback to DB: ${err.message}`
    });
  }

  try {
    const rows = await getRoutes();

    if (rows.length > 0) {
      try {
        await redisClient.set(ROUTES_CACHE_KEY, JSON.stringify(rows), {
          EX: 3600,
        });
        logData({
          level: 'info',
          proccessName,
          data: 'Routes cached to Redis',
        });
      } catch (err) {
        logData({
          level: 'warn',
          proccessName,
          data: `Redis set failed: ${err.message}`
        });
      }
    }

    return rows;
  } catch (err) {
    logData({
      level: 'error',
      proccessName,
      data: `DB query failed: ${err.message}`
    });
    return [];
  }
};

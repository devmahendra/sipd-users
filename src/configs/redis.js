const { createClient } = require('redis');
const { logData } = require('../utils/loggers');

const proccessName = 'REDIS_CLIENT';

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logData({
          level: 'error',
          proccessName: proccessName,
          data: 'Too many Redis reconnect attempts. Giving up. Reconnect failed.',
        });
        return new Error('Redis reconnect failed');
      }
      logData({
        level: 'warn',
        proccessName: proccessName,
        data: `Retrying Redis connection... attempt ${retries}`,
      });
      return Math.min(retries * 100, 3000); // exponential backoff, max 3s
    }
  }
});

// Listen for client-level errors
redisClient.on('error', (err) => {
  logData({
    level: 'error',
    proccessName: proccessName,
    data: `Redis client error: ${err.message || err}`,
  });
});

redisClient.on('reconnecting', () => {
  logData({
    level: 'warn',
    proccessName: proccessName,
    data: 'Redis client reconnecting...',
  });
});

redisClient.on('connect', () => {
  logData({
    level: 'info',
    proccessName: proccessName,
    data: 'Redis attempting connection...',
  });
});

redisClient.on('ready', () => {
  logData({
    level: 'info',
    proccessName: proccessName,
    data: 'Redis is ready!',
  });
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      logData({
        level: 'info',
        proccessName: proccessName,
        data: 'Redis connected successfully',
      });
    } catch (err) {
      logData({
        level: 'error',
        proccessName: proccessName,
        data: `Redis connection failed: ${err.message || err}`,
      });
    }
  }
}

connectRedis();

module.exports = { redisClient, connectRedis };

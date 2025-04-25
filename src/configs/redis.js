const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Too many Redis reconnect attempts. Giving up.');
        return new Error('Redis reconnect failed');
      }
      console.warn(`⚠️ Retrying Redis connection... attempt ${retries}`);
      return Math.min(retries * 100, 3000); // exponential backoff, max 3s
    }
  }
});

// Listen for client-level errors
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err.message || err);
});

redisClient.on('reconnecting', () => {
  console.warn('⚠️ Redis reconnecting...');
});

redisClient.on('connect', () => {
  console.log('✅ Redis attempting connection...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis is ready!');
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log('✅ Redis connected successfully');
    } catch (err) {
      console.error('🚨 Redis connection failed:', err.message || err);
    }
  }
}

// Immediately try to connect (optional: you can delay or conditionally call this in main app)
connectRedis();

module.exports = { redisClient, connectRedis };

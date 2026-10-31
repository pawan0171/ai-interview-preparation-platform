const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
let redisClient = null;
let isConnected = false;
let hasLoggedOfflineWarning = false;

try {
  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 3) {
        if (!hasLoggedOfflineWarning) {
          console.log('⚠️  Redis server is offline. Application will fall back gracefully to direct MongoDB queries.');
          hasLoggedOfflineWarning = true;
        }
        return null; // Stop reconnect attempts
      }
      return Math.min(times * 1000, 3000);
    }
  });

  redisClient.on('connect', () => {
    isConnected = true;
    console.log(`✅ Redis In-Memory Cache Connected: ${redisUrl}`);
  });

  redisClient.on('error', (err) => {
    isConnected = false;
    if (!hasLoggedOfflineWarning) {
      console.log('⚠️  Redis connection unavailable. Operating in cache-bypass mode.');
      hasLoggedOfflineWarning = true;
    }
  });

  // Attempt initial connection asynchronously
  redisClient.connect().catch(() => {
    // Handled in 'error' event
  });
} catch (err) {
  console.log('⚠️  Redis client initialization skipped. Direct database mode active.');
}

/**
 * Retrieve cached data by key
 * @param {string} key
 * @returns {Promise<any|null>}
 */
const getCache = async (key) => {
  if (!redisClient || !isConnected) return null;
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

/**
 * Store data in Redis cache with TTL
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds - Default 60 seconds
 */
const setCache = async (key, value, ttlSeconds = 60) => {
  if (!redisClient || !isConnected) return;
  try {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await redisClient.set(key, stringValue, 'EX', ttlSeconds);
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (err) {
    // Fail silently so database operations proceed
  }
};

/**
 * Invalidate a specific cache key
 * @param {string} key
 */
const delCache = async (key) => {
  if (!redisClient || !isConnected) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    // Fail silently
  }
};

/**
 * Invalidate cache keys matching pattern
 * @param {string} pattern - e.g. "leaderboard:*"
 */
const delCachePattern = async (pattern) => {
  if (!redisClient || !isConnected) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    // Fail silently
  }
};

module.exports = {
  redisClient,
  getCache,
  setCache,
  delCache,
  delCachePattern,
  isRedisAvailable: () => isConnected
};

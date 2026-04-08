const Redis = require('ioredis');

const isTest = process.env.NODE_ENV === 'test';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redis = null;
let isRedisConnected = false;

const connectRedis = () => {
  // 🚀 HARD DISABLE in test
  if (isTest) return null;

  if (redis) return redis;

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true,
      connectTimeout: 10000,
    });

    redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    redis.on('ready', () => {
      isRedisConnected = true;
    });

    // 🚀 COMPLETELY SILENT in test (no logs, no crashes)
    redis.on('error', () => {
      isRedisConnected = false;
    });

    redis.on('close', () => {
      isRedisConnected = false;
    });

    // Helper to check connection
    redis.isReady = () => isRedisConnected;

    // Auto-connect ONLY if not test
    redis.connect().catch(() => {});

    return redis;
  } catch (err) {
    if (!isTest) {
      console.error('Failed to create Redis client:', err.message);
    }
    return null;
  }
};

// 🚀 CRITICAL: do NOT even call connectRedis in test
const redisClient = isTest ? null : connectRedis();

// Cache helper functions
const cacheHelpers = {
  productKey: (prefix, params = {}) => {
    const paramsStr =
      Object.keys(params).length > 0 ? JSON.stringify(params) : '';
    return `products:${prefix}:${paramsStr}`;
  },

  searchKey: (query) => {
    return `search:${query.trim().toLowerCase()}`;
  },

  get: async (key) => {
    if (!redisClient || !redisClient.isReady?.()) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null; // 🚀 silent fail
    }
  },

  set: async (key, value, ttlSeconds = 300) => {
    if (!redisClient || !redisClient.isReady?.()) return false;
    try {
      await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch {
      return false; // 🚀 silent fail
    }
  },

  del: async (key) => {
    if (!redisClient || !redisClient.isReady?.()) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch {
      return false;
    }
  },

  invalidateProductCache: async () => {
    if (!redisClient || !redisClient.isReady?.()) return false;
    try {
      const keys = await redisClient.keys('products:*');
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      return true;
    } catch {
      return false;
    }
  },

  invalidateSearchCache: async () => {
    if (!redisClient || !redisClient.isReady?.()) return false;
    try {
      const keys = await redisClient.keys('search:*');
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      return true;
    } catch {
      return false;
    }
  },
};

module.exports = { redis: redisClient, ...cacheHelpers };
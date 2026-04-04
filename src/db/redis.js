const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redis = null;

const connectRedis = () => {
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

    redis.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });

    // Auto-connect
    redis.connect().catch(() => {
      // Connection will be retried automatically
    });

    return redis;
  } catch (err) {
    console.error('Failed to create Redis client:', err.message);
    return null;
  }
};

// Initialize connection
const redisClient = connectRedis();

// Cache helper functions
const cacheHelpers = {
  // Generate cache key for products
  productKey: (prefix, params = {}) => {
    const paramsStr = Object.keys(params).length > 0 ? JSON.stringify(params) : '';
    return `products:${prefix}:${paramsStr}`;
  },

  // Generate cache key for search
  searchKey: (query) => {
    return `search:${query.trim().toLowerCase()}`;
  },

  // Get cached data
  get: async (key) => {
    if (!redisClient) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Redis get error:', err.message);
      return null;
    }
  },

  // Set cached data with TTL
  set: async (key, value, ttlSeconds = 300) => {
    if (!redisClient) return false;
    try {
      await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Redis set error:', err.message);
      return false;
    }
  },

  // Delete cached data
  del: async (key) => {
    if (!redisClient) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (err) {
      console.error('Redis del error:', err.message);
      return false;
    }
  },

  // Invalidate all product caches (patterns)
  invalidateProductCache: async () => {
    if (!redisClient) return false;
    try {
      const keys = await redisClient.keys('products:*');
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      return true;
    } catch (err) {
      console.error('Redis invalidate error:', err.message);
      return false;
    }
  },

  // Invalidate search cache
  invalidateSearchCache: async () => {
    if (!redisClient) return false;
    try {
      const keys = await redisClient.keys('search:*');
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      return true;
    } catch (err) {
      console.error('Redis search invalidate error:', err.message);
      return false;
    }
  },
};

module.exports = { redis: redisClient, ...cacheHelpers };
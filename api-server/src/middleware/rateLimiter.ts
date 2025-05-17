import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { env } from '../config/env';
import RedisClient from '../config/redis';

/**
 * Configure rate limiting middleware
 * 
 * In production with multiple instances, this will use Redis as a store
 * to maintain consistent rate limiting across all instances.
 */
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT.WINDOW_MS,
  max: env.RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: env.RATE_LIMIT.STANDARD_HEADERS,
  legacyHeaders: env.RATE_LIMIT.LEGACY_HEADERS,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  // Use Redis store for distributed rate limiting if enabled
  ...(env.RATE_LIMIT.STORE_CLIENT ? {
    store: new RedisStore({
      // @ts-ignore - Redis type mismatch between libraries
      sendCommand: (...args: string[]) => RedisClient.getInstance().call(...args),
    }),
  } : {})
});
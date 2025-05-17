import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration with fallback values
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  MONGODB: {
    URI: process.env.MONGO_URI || 'mongodb://localhost:27017/koinx',
  },
  
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    URL: process.env.REDIS_URL || 'redis://localhost:6379',
    CHANNEL: process.env.REDIS_CHANNEL || 'crypto-updates',
  },
  
  API: {
    COINGECKO_URL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000', 10), // 10 seconds
  },
  
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute default
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX || '60', 10), // 60 requests per minute default
    STANDARD_HEADERS: process.env.RATE_LIMIT_HEADERS === 'true', // Add rate limit info to headers
    LEGACY_HEADERS: process.env.RATE_LIMIT_LEGACY_HEADERS !== 'false', // X-RateLimit-* headers
    STORE_CLIENT: process.env.RATE_LIMIT_REDIS_STORE === 'true', // Use Redis for distributed rate limiting
  },
  
  SUPPORTED_COINS: (process.env.SUPPORTED_COINS || 'bitcoin,ethereum,matic-network').split(','),
};

// Type guard for production environment
export const isProduction = env.NODE_ENV === 'production';

export default env; 
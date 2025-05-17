import Redis from 'ioredis';
import { env } from './env';

/**
 * Redis client singleton
 */
class RedisClient {
  private static instance: Redis | null = null;

  /**
   * Get the Redis client instance (creates one if it doesn't exist)
   */
  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      // Use REDIS_URL if available, otherwise fall back to host/port config
      const redisUrl = env.REDIS.URL;
      
      if (redisUrl) {
        RedisClient.instance = new Redis(redisUrl);
        console.log('Connected to Redis using URL');
      } else {
        RedisClient.instance = new Redis({
          host: env.REDIS.HOST,
          port: env.REDIS.PORT,
        });
        console.log('Connected to Redis using host/port configuration');
      }

      // Handle Redis connection events
      RedisClient.instance.on('connect', () => {
        console.log('Connected to Redis');
      });
      
      RedisClient.instance.on('error', (err: Error) => {
        console.error('Redis connection error:', err);
      });
    }
    
    return RedisClient.instance;
  }

  /**
   * Close the Redis connection
   */
  public static async closeConnection(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
      console.log('Redis connection closed');
      RedisClient.instance = null;
    }
  }
}

export default RedisClient; 
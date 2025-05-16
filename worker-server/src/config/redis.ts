import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Redis client singleton
 */
class RedisClient {
  private static instance: Redis | null = null;

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      });

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
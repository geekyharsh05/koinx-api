import dotenv from 'dotenv';
import RedisClient from './config/redis';

dotenv.config();

const redis = RedisClient.getInstance();

const REDIS_CHANNEL = 'crypto-updates';
const UPDATE_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

async function publishUpdateMessage() {
  try {
    const message = {
      trigger: 'update',
      timestamp: new Date().toISOString()
    };

    // Publish message to the Redis channel
    const subscribers = await redis.publish(REDIS_CHANNEL, JSON.stringify(message));
    console.log(`[${new Date().toISOString()}] Published update message to ${REDIS_CHANNEL}, received by ${subscribers} subscriber(s)`);
  } catch (error) {
    console.error('Error publishing message to Redis:', error);
  }
}

// Immediately publish a message on startup
publishUpdateMessage();

// Set up interval to publish messages
console.log(`Worker server started. Publishing crypto update triggers every ${UPDATE_INTERVAL_MS / 60000} minutes`);
setInterval(publishUpdateMessage, UPDATE_INTERVAL_MS);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await RedisClient.closeConnection();
  process.exit(0);
});
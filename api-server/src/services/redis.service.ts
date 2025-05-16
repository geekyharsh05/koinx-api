import Redis from 'ioredis';
import dotenv from 'dotenv';
import { CryptoService } from './crypto.service';
import RedisClient from '../config/redis';

dotenv.config();

export class RedisService {
  private redis: Redis;
  private cryptoService: CryptoService;
  private readonly REDIS_CHANNEL = 'crypto-updates';
  private isSubscribed = false;
  
  constructor(cryptoService: CryptoService) {
    this.cryptoService = cryptoService;
    this.redis = RedisClient.getInstance();
  }

  async subscribeToUpdates(): Promise<void> {
    try {
      // Skip if already subscribed
      if (this.isSubscribed) {
        console.log(`Already subscribed to Redis channel: ${this.REDIS_CHANNEL}`);
        return;
      }

      console.log(`Setting up subscription to Redis channel: ${this.REDIS_CHANNEL}`);
      
      await this.redis.subscribe(this.REDIS_CHANNEL);
      this.isSubscribed = true;
      console.log(`Subscribed to Redis channel: ${this.REDIS_CHANNEL}`);
      
      // Listen for messages separately
      this.redis.on('message', this.handleMessage.bind(this));
    } catch (error) {
      console.error('Error setting up Redis subscription:', error);
    }
  }

  private handleMessage = (channel: string, message: string): void => {
    if (channel === this.REDIS_CHANNEL) {
      console.log(`[${new Date().toISOString()}] Received update message from Redis:`, message);
      
      try {
        const data = JSON.parse(message);
        
        if (data.trigger === 'update') {
          console.log('Triggering crypto stats update...');
          this.handleUpdateTrigger();
        }
      } catch (error) {
        console.error('Error processing Redis message:', error);
      }
    }
  }

  private async handleUpdateTrigger(): Promise<void> {
    try {
      const result = await this.cryptoService.storeCryptoStats();
      console.log(`Update triggered by worker: ${result.message}`);
    } catch (error) {
      console.error('Error handling update trigger:', error);
    }
  }
  
  async unsubscribe(): Promise<void> {
    try {
      if (!this.isSubscribed) {
        console.log(`Not subscribed to Redis channel: ${this.REDIS_CHANNEL}`);
        return;
      }
      
      // Remove message listener
      this.redis.removeListener('message', this.handleMessage);
      
      await this.redis.unsubscribe(this.REDIS_CHANNEL);
      this.isSubscribed = false;
      console.log(`Unsubscribed from Redis channel: ${this.REDIS_CHANNEL}`);
    } catch (error) {
      console.error('Error unsubscribing from Redis channel:', error);
    }
  }
} 
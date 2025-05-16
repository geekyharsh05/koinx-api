import axios from 'axios';
import { CryptoStats } from '../models/crypto.model';

export class CryptoService {
  private readonly COINGECKO_API_URL = process.env.COINGECKO_API_URL;
  private readonly SUPPORTED_COINS = ['bitcoin', 'ethereum', 'matic-network'];

  async storeCryptoStats(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.get(`${this.COINGECKO_API_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: this.SUPPORTED_COINS.join(','),
          order: 'market_cap_desc',
          per_page: this.SUPPORTED_COINS.length,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });

      const cryptoData = response.data;
      if (!cryptoData || !Array.isArray(cryptoData) || cryptoData.length === 0) {
        console.error('Invalid or empty response from CoinGecko API');
        return { 
          success: false, 
          message: 'Failed to retrieve cryptocurrency data from external API' 
        };
      }

      // Process and store data for each coin
      const savePromises = cryptoData.map(async (data: any) => {
        const stats = new CryptoStats({
          coin: data.id,
          priceUsd: data.current_price,
          marketCapUsd: data.market_cap,
          change24h: data.price_change_percentage_24h,
        });

        return stats.save();
      });

      await Promise.all(savePromises);
      console.log('Cryptocurrency stats stored successfully');
      return { 
        success: true, 
        message: `Successfully stored stats for ${cryptoData.length} cryptocurrencies` 
      };
    } catch (error) {
      console.error('Error storing cryptocurrency stats:', error);
      return { 
        success: false, 
        message: 'Failed to store cryptocurrency statistics' 
      };
    }
  }

  async getLatestStats(coin: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      if (!this.SUPPORTED_COINS.includes(coin)) {
        return { 
          success: false, 
          message: `Unsupported coin: ${coin}. Supported coins are: ${this.SUPPORTED_COINS.join(', ')}` 
        };
      }

      const stats = await CryptoStats.findOne({ coin })
        .sort({ timestamp: -1 })
        .lean();

      if (!stats) {
        return { 
          success: false, 
          message: `No data available for ${coin}. Please try again later.` 
        };
      }

      return {
        success: true,
        data: {
          price: stats.priceUsd,
          marketCap: stats.marketCapUsd,
          "24hChange": stats.change24h
        }
      };
    } catch (error) {
      console.error(`Error fetching latest stats for ${coin}:`, error);
      return { 
        success: false, 
        message: 'Failed to retrieve cryptocurrency statistics' 
      };
    }
  }

  async getPriceDeviation(coin: string): Promise<{ success: boolean; deviation?: number; message?: string }> {
    try {
      if (!this.SUPPORTED_COINS.includes(coin)) {
        return { 
          success: false, 
          message: `Unsupported coin: ${coin}. Supported coins are: ${this.SUPPORTED_COINS.join(', ')}` 
        };
      }

      // Get the last 100 records for the specified coin
      const stats = await CryptoStats.find({ coin })
        .sort({ timestamp: -1 })
        .limit(100)
        .lean();

      if (!stats.length) {
        return { 
          success: false, 
          message: `No data available for ${coin}. Please try again later.` 
        };
      }

      // Extract prices
      const prices = stats.map(stat => stat.priceUsd);

      // Calculate mean
      const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;

      // Calculate sum of squared differences
      const squaredDiffsSum = prices.reduce((sum, price) => {
        const diff = price - mean;
        return sum + (diff * diff);
      }, 0);

      // Calculate standard deviation
      const standardDeviation = Math.sqrt(squaredDiffsSum / prices.length);

      return { 
        success: true, 
        deviation: Number(standardDeviation.toFixed(2)) 
      };
    } catch (error) {
      console.error(`Error calculating price deviation for ${coin}:`, error);
      return { 
        success: false, 
        message: 'Failed to calculate price deviation' 
      };
    }
  }
} 
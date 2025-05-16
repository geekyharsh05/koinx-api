import type { Request, Response } from 'express';
import { CryptoService } from '../services/crypto.service';

export class CryptoController {
  private cryptoService: CryptoService;

  constructor() {
    this.cryptoService = new CryptoService();
  }

  async getStats(req: Request, res: Response): Promise<void> {
    const { coin } = req.query;

    if (!coin || typeof coin !== 'string') {
      res.status(400).json({ 
        success: false, 
        message: 'Coin parameter is required' 
      });
      return;
    }

    const result = await this.cryptoService.getLatestStats(coin);
    
    if (!result.success) {
      const statusCode = result.message?.includes('Unsupported coin') ? 400 : 500;
      res.status(statusCode).json({ 
        success: false, 
        message: result.message 
      });
      return;
    }
    
    res.json({
      success: true,
      data: result.data
    });
  }

  async getDeviation(req: Request, res: Response): Promise<void> {
    const { coin } = req.query;

    if (!coin || typeof coin !== 'string') {
      res.status(400).json({ 
        success: false, 
        message: 'Coin parameter is required' 
      });
      return;
    }

    const result = await this.cryptoService.getPriceDeviation(coin);
    
    if (!result.success) {
      const statusCode = result.message?.includes('Unsupported coin') ? 400 : 500;
      res.status(statusCode).json({ 
        success: false, 
        message: result.message 
      });
      return;
    }
    
    res.json({
      success: true,
      deviation: result.deviation
    });
  }
} 
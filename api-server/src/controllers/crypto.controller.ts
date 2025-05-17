import type { Request, RequestHandler } from 'express';
import { CryptoService } from '../services/crypto.service';
import { asyncHandler } from '../utils/asynchandler.util';
import { validateCoinParam, handleServiceError } from '../utils/controller.util';

export class CryptoController {
  private cryptoService: CryptoService;

  constructor() {
    this.cryptoService = new CryptoService();
  }

  public getStats: RequestHandler = asyncHandler(async (req: Request) => {
    const { coin } = req.query;
    validateCoinParam(coin as string);
    
    // Then get the latest stats
    const result = await this.cryptoService.getLatestStats(coin as string);
    handleServiceError(result);
    
    return {
      success: true,
      data: result.data
    };
  });

  public getDeviation: RequestHandler = asyncHandler(async (req: Request) => {
    const { coin } = req.query;
    validateCoinParam(coin as string);

    const result = await this.cryptoService.getPriceDeviation(coin as string);
    handleServiceError(result);
    
    return {
      success: true,
      deviation: result.deviation
    };
  });
} 
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
      message: 'Stats retrieved successfully',
      data: result.data
    };
  });

  public getDeviation: RequestHandler = asyncHandler(async (req: Request) => {
    const { coin } = req.query;
    validateCoinParam(coin as string);

    const result = await this.cryptoService.getPriceDeviation(coin as string);
    handleServiceError(result);
    
    return {
      message: 'Deviation calculated successfully',
      deviation: result.deviation
    };
  });

  public refreshStats: RequestHandler = asyncHandler(async () => {
    const result = await this.cryptoService.storeCryptoStats();
    
    if (!result.success) {
      throw {
        status: 500,
        message: result.message
      };
    }
    
    return {
      message: 'Cryptocurrency stats refreshed successfully'
    };
  });
} 
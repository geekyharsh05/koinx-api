import { Router } from 'express';
import { CryptoController } from '../controllers/crypto.controller';
import type { Request, Response } from 'express';

const router = Router();
const cryptoController = new CryptoController();

router.get('/stats', (req: Request, res: Response) => cryptoController.getStats(req, res));
router.get('/deviation', (req: Request, res: Response) => cryptoController.getDeviation(req, res));

export default router;
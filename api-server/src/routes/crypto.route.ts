import { Router } from 'express';
import { CryptoController } from '../controllers/crypto.controller';
import type { Request, Response } from 'express';

const router = Router();
const cryptoController = new CryptoController();

/**
 * @swagger
 * /api/crypto/stats:
 *   get:
 *     summary: Get statistics for a cryptocurrency
 *     tags: [Crypto]
 *     parameters:
 *       - in: query
 *         name: coin
 *         schema:
 *           type: string
 *         required: true
 *         description: The cryptocurrency symbol (e.g., BTC, ETH)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/stats', (req: Request, res: Response) => cryptoController.getStats(req, res));

/**
 * @swagger
 * /api/crypto/deviation:
 *   get:
 *     summary: Get price deviation for a cryptocurrency
 *     tags: [Crypto]
 *     parameters:
 *       - in: query
 *         name: coin
 *         schema:
 *           type: string
 *         required: true
 *         description: The cryptocurrency symbol (e.g., BTC, ETH)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deviation:
 *                   type: number
 *                   example: 0.45
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/deviation', (req: Request, res: Response) => cryptoController.getDeviation(req, res));

export default router;
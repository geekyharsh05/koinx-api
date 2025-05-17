import { Router } from 'express';
import { CryptoController } from '../controllers/crypto.controller';


const router = Router();
const cryptoController = new CryptoController();

/**
 * @swagger
 * /api/v1/stats:
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
router.get('/stats', cryptoController.getStats);

/**
 * @swagger
 * /api/v1/deviation:
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
router.get('/deviation', cryptoController.getDeviation);

export default router;
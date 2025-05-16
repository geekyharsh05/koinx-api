import express from "express";
import morgan from "morgan";
import { Database } from "./config/db";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cryptoRoutes from "./routes/crypto.route";
import { CryptoService } from "./services/crypto.service";
import { RedisService } from "./services/redis.service";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;
const cryptoService = new CryptoService();
const redisService = new RedisService(cryptoService);

app.use(express.json());
app.use(morgan("dev"));

app.use('/api/v1', cryptoRoutes);

app.get("/", (_ , res: Response) => {
  res.send("Crypto API Service");
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Something went wrong',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });


async function setupRedisSubscription() {
  try {
    await redisService.subscribeToUpdates();
    console.log("Successfully subscribed to Redis for worker-triggered updates");
  } catch (error) {
    console.error("Failed to setup Redis subscription:", error);
  }
}

const startServer = async () => {
    try {
      const db = Database.getInstance();
      await db.connect();
      await setupRedisSubscription();
  
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });

      // Setup graceful shutdown
      process.on('SIGINT', async () => {
        console.log('Shutting down gracefully...');
        await redisService.unsubscribe();
        process.exit(0);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };
  
startServer();
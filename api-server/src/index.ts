import express from "express";
import morgan from "morgan";
import { Database } from "./config/db";
import type { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import cryptoRoutes from "./routes/crypto.route";
import { CryptoService } from "./services/crypto.service";
import { RedisService } from "./services/redis.service";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./utils/swagger";
import { env, isProduction } from "./config/env";
import { rateLimiter } from "./middleware/rateLimiter";

const app = express();

// Trust proxy - configured to only trust the first proxy in the chain
app.set('trust proxy', 1);
const port = env.PORT;
const cryptoService = new CryptoService();
const redisService = new RedisService(cryptoService);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(cors());
app.use(rateLimiter);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1', cryptoRoutes);

app.get("/", (_, res: Response) => {
  res.send("Crypto API Service");
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Something went wrong',
      message: isProduction ? undefined : err.message
    });
  });

// Setup Redis subscription
const setupRedisSubscription = async () => {
  try {
    await redisService.subscribeToUpdates();
    console.log("Redis subscription setup complete.");
  } catch (error) {
    console.error("Failed to setup Redis subscription:", error);
  }
};

const startServer = async () => {
    try {
      const db = Database.getInstance();
      await db.connect();
      await setupRedisSubscription();
  
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
        console.log(`Environment: ${env.NODE_ENV}`);
        console.log(`Rate limit: ${env.RATE_LIMIT.MAX_REQUESTS} requests per ${env.RATE_LIMIT.WINDOW_MS/1000} seconds`);
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
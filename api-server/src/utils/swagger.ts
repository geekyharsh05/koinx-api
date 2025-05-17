import { env } from '../config/env';

export const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Crypto API",
        version: "1.0.0",
        description: "API for cryptocurrency statistics",
      },
      servers: [
        {
          url: "https://cryptoapi.theharsh.xyz",
          description: "Production server"
        },
        {
          url: `http://localhost:${env.PORT}`,
          description: "Development server"
        }
      ],
    },
    apis: ["./src/routes/*.ts"],
  };
  
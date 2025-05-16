# Crypto Stats API Server

A Node.js API server that fetches and stores cryptocurrency statistics from CoinGecko API.

## Features

- Automatically fetches and stores crypto data for Bitcoin, Ethereum, and Matic Network
- API endpoint to get latest stats for a specific cryptocurrency
- API endpoint to calculate standard deviation of price for the last 100 records
- Subscribes to Redis pub/sub messages from the worker server

## Setup

1. Install dependencies:

   ```
   bun install
   ```

2. Create a `.env` file in the root directory with the following content:

   ```
   MONGO_URI=mongodb://localhost:27017/crypto-stats
   PORT=3000
   NODE_ENV=development
   COINGECKO_API_URL=https://api.coingecko.com/api/v3
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_password_if_any
   ```

3. Start the server:
   ```
   bun run dev
   ```

## API Endpoints

- `GET /api/v1/stats?coin=bitcoin` - Get latest stats for a cryptocurrency
- `GET /api/v1/deviation?coin=bitcoin` - Get standard deviation of price for the last 100 records

Supported coins: `bitcoin`, `ethereum`, `matic-network`

This project was created using `bun init` in bun v1.2.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

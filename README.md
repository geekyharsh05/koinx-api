# KoinX Crypto Tracker

A real-time cryptocurrency price tracking system with an API server and background worker service.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [TypeGoose](https://typegoose.github.io/typegoose/) for type-safe models
- **Worker**: [Redis](https://redis.io/) for pub/sub and ratelimiting.
- **API Documentation**: [Swagger](https://swagger.io/) for interactive API docs
- **Deployment**: [Coolify](https://coolify.io/) on VPS

## Architecture

The application consists of two main services:

1. **API Server**: Handles HTTP requests and provides crypto data to clients
2. **Worker Server**: Runs scheduled tasks to fetch and update cryptocurrency data

## Setup Instructions

### Prerequisites

- Bun installed on your machine
- MongoDB instance
- Redis server

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/geekyharsh05/koinx-assignment.git
cd koinx-assignment
```

2. Set up environment variables for both services:

**api-server/.env**:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/koinx
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

**worker-server/.env**:

```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
```

3. Install dependencies and start the API server:

```bash
cd api-server
bun install
bun run dev
```

4. In a separate terminal, start the Worker server:

```bash
cd worker-server
bun install
bun run dev
```

### Docker Setup

For containerized development:

```bash
docker-compose up -d
```

This starts the API server, Worker server, MongoDB, and Redis.

## API Documentation

Interactive API documentation is available via Swagger UI:

- Local: http://localhost:3000/api-docs
- Production: https://cryptoapi.theharsh.xyz/api-docs

## API Endpoints

- `GET /api/v1/stats?coin=bitcoin` - Get latest crypto stats
- `GET /api/v1/deviation?coin=bitcoin` - Get price deviation

### Supported Coins

- bitcoin
- ethereum
- matic-network

## Deployment

The application is deployed using Coolify on a VPS:

## Performance Optimizations

- Compound MongoDB index on coin and timestamp for efficient queries
- Redis pub/sub for communication between services
- Periodic data caching with configurable refresh intervals

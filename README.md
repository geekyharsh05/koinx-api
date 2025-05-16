# KoinX Assignment

A cryptocurrency price tracking system with API server and worker service.

## Docker Setup

This project is containerized using Docker and can be easily run using Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Running the Application

1. Clone the repository
2. Create `.env` files for both services:
   - `api-server/.env`
   - `worker-server/.env`
3. Build and start the containers:

```bash
docker-compose up -d
```

This will start:

- API server on port 3000
- Worker server that publishes updates every 15 minutes
- Redis instance on port 6379

### Stopping the Application

```bash
docker-compose down
```

## Development

### API Server

```bash
cd api-server
bun install
bun run dev
```

### Worker Server

```bash
cd worker-server
bun install
bun run dev
```

## API Endpoints

- `GET /api/v1/stats?coin=bitcoin` - Get latest crypto stats
- `GET /api/v1/deviation?coin=bitcoin` - Get price deviation

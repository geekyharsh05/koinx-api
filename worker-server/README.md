# Worker Server

A background job server that triggers cryptocurrency data updates via Redis pub/sub.

## Features

- Publishes update messages to Redis every 15 minutes
- Uses Redis pub/sub for messaging

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create a `.env` file in the root directory with the following content:

   ```
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_password_if_any
   ```

3. Start the server:
   ```bash
   bun run dev
   ```

## How it works

The worker server publishes a message to the Redis channel 'crypto-updates' every 15 minutes. The message contains a trigger command and a timestamp. The API server subscribes to this channel and fetches new cryptocurrency data when it receives a message.

This project was created using `bun init` in bun v1.2.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

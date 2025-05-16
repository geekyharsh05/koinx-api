FROM oven/bun:1.2.12

WORKDIR /usr/src/app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "start"]

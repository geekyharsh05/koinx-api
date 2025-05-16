FROM oven/bun:1.2.12

WORKDIR /usr/src/app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "start"]
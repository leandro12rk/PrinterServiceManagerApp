FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-timeout 120000 \
    && npm ci --legacy-peer-deps --no-audit --no-fund

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm run dev"]
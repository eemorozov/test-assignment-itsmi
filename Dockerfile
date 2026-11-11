# Multi-stage Docker build for production security and minimal image size

# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy full application source
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src/

# Generate Prisma Client and compile NestJS application
RUN npx prisma generate
RUN npm run build

# Prune development dependencies
RUN npm prune --production

# ==========================================
# Stage 2: Production runner stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Create non-root system user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

USER appuser

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/src/main.js"]

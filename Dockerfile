# ============================
# Base
# ============================
FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

# ============================
# Dependencies
# ============================
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ============================
# Production dependencies
# ============================
FROM base AS deps-prod
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ============================
# Build
# ============================
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm exec prisma generate

RUN pnpm exec tsc && pnpm exec tsc-alias

# ============================
# Runtime
# ============================
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=build /app/dist ./dist
COPY --from=deps-prod /app/node_modules ./node_modules
COPY package.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# Copiar o script de entrada
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
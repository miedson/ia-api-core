# ============================
# Base
# ============================
FROM node:20-alpine AS base
WORKDIR /app

# Para dependências nativas (ex: onnxruntime, etc)
RUN apk add --no-cache libc6-compat

# Habilita pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# ============================
# Dependencies
# ============================
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ============================
# Build
# ============================
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run format || true
RUN pnpm exec tsc && pnpm exec tsc-alias

# ============================
# Runtime (produção)
# ============================
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
# One Dockerfile for both apps. Build with --build-arg APP=landing|panel.
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.31.0 --activate
WORKDIR /app

# 1. Prune the monorepo down to the app and the packages it uses.
FROM base AS pruner
ARG APP
RUN npm install -g turbo@2.11.13
COPY . .
RUN turbo prune ${APP} --docker

# 2. Install dependencies (cached layer), then build.
FROM base AS builder
ARG APP
ARG NEXT_PUBLIC_LANDING_URL
ARG NEXT_PUBLIC_PANEL_URL
ENV NEXT_PUBLIC_LANDING_URL=${NEXT_PUBLIC_LANDING_URL} \
    NEXT_PUBLIC_PANEL_URL=${NEXT_PUBLIC_PANEL_URL} \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=${APP}

# 3. Minimal runtime with the standalone server.
FROM node:22-alpine AS runner
ARG APP
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    APP=${APP}
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static
USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "node apps/${APP}/server.js"]

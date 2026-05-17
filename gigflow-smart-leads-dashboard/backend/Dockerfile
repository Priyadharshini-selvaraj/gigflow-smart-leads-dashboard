# ─────────────────────────────────────────────────────────────────
# Stage 1: deps — install ALL dependencies (needed to compile TS)
# ─────────────────────────────────────────────────────────────────
FROM node:20.11-alpine3.19 AS deps

WORKDIR /app

# Install dumb-init for proper PID 1 signal handling
RUN apk add --no-cache dumb-init

# Copy manifests first — Docker layer-cache skips npm ci if unchanged
COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

# ─────────────────────────────────────────────────────────────────
# Stage 2: builder — compile TypeScript
# ─────────────────────────────────────────────────────────────────
FROM node:20.11-alpine3.19 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src

RUN npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 3: production — lean image, prod deps only, non-root user
# ─────────────────────────────────────────────────────────────────
FROM node:20.11-alpine3.19 AS production

LABEL org.opencontainers.image.title="GigFlow Backend" \
      org.opencontainers.image.description="GigFlow Smart Leads Dashboard – REST API" \
      org.opencontainers.image.source="https://github.com/yourusername/gigflow-smart-leads-dashboard"

WORKDIR /app

# dumb-init from the deps stage
COPY --from=deps /usr/bin/dumb-init /usr/bin/dumb-init

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Create non-root user and fix ownership in one layer
RUN addgroup -g 1001 -S gigflow && \
    adduser  -u 1001 -S gigflow -G gigflow && \
    chown -R gigflow:gigflow /app

USER gigflow

EXPOSE 5000

# Health probe — wget ships with alpine, no extra deps
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# dumb-init as PID 1 forwards signals correctly (SIGTERM → graceful shutdown)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/app.js"]

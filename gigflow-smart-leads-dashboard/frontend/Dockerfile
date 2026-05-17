# ─────────────────────────────────────────────────────────────────
# Stage 1: deps — install dependencies with layer-cache optimisation
# ─────────────────────────────────────────────────────────────────
FROM node:20.11-alpine3.19 AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ─────────────────────────────────────────────────────────────────
# Stage 2: builder — compile + Vite build
# VITE_API_BASE_URL is baked into the static bundle at build time.
# Pass it with: docker build --build-arg VITE_API_BASE_URL=https://…
# ─────────────────────────────────────────────────────────────────
FROM node:20.11-alpine3.19 AS builder

WORKDIR /app

# Declare the build arg BEFORE the first RUN/COPY that uses it
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 3: production — nginx serves the SPA and proxies /api/*
# ─────────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine3.18 AS production

LABEL org.opencontainers.image.title="GigFlow Frontend" \
      org.opencontainers.image.description="GigFlow Smart Leads Dashboard – React SPA" \
      org.opencontainers.image.source="https://github.com/yourusername/gigflow-smart-leads-dashboard"

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our production nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx runs as root by default in the official image; restrict to port 8080
# so we can run as a non-root user in locked-down environments
EXPOSE 80

# Validate config at build time — fails fast if nginx.conf has a syntax error
RUN nginx -t

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

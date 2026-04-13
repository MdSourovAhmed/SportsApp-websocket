# ── Stage 1: dependencies ────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ── Stage 2: development ─────────────────────────────────────────────────
# Runs the Vite dev server with hot-module replacement.
# Source code is bind-mounted from the host so edits are instant.
FROM node:22-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
EXPOSE 5173
# --host 0.0.0.0 is required so Vite listens on all interfaces inside Docker,
# not just 127.0.0.1, which would make the port unreachable from the host.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ── Stage 3: build ───────────────────────────────────────────────────────
# Compiles the React app into static files under /app/dist.
# Build args are baked in at image build time — you must pass them via
# docker-compose build args or --build-arg.
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# These are injected at build time by docker-compose (see compose files)
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_ADMIN_PASSWORD
RUN npm run build

# ── Stage 4: production ──────────────────────────────────────────────────
# Serves the compiled static files with nginx. The image is ~25 MB.
FROM nginx:1.27-alpine AS production
# Remove the default nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Our custom config (SPA routing + WebSocket proxy + compression)
COPY nginx/nginx.conf /etc/nginx/conf.d/app.conf
# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx starts in foreground by default in the official image
CMD ["nginx", "-g", "daemon off;"]
# ── Stage 1: dependencies ────────────────────────────────────────────────
# Install all packages first in a separate layer so the image cache is
# invalidated only when package.json changes, not on every code change.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json drizzle.config.js ./
RUN npm ci --ignore-scripts

# ── Stage 2: development ─────────────────────────────────────────────────
# Mounts source code from the host via a volume bind, so changes are
# reflected instantly without rebuilding the image.
FROM node:22-alpine AS development
WORKDIR /app

# Copy node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json drizzle.config.js ./

# Don't copy src here — docker-compose mounts it as a volume in dev
EXPOSE 7000
# --watch restarts the process whenever any .js file changes
CMD ["node", "--watch", "src/index.js"]

# ── Stage 3: production ──────────────────────────────────────────────────
# Copies only what's needed to run. No devDependencies, no source maps,
# no watch mode. The resulting image is ~170 MB.
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Re-install with --omit=dev to skip devDependencies (drizzle-kit etc.)
COPY package.json package-lock.json drizzle.config.js ./
RUN npm ci --omit=dev --ignore-scripts && \
    # Remove npm cache to keep the image slim
    npm cache clean --force

# Copy application source
COPY src ./src
COPY drizzle.config.js ./

EXPOSE 7000

# Run as a non-root user for security
RUN addgroup -S arena && adduser -S arena -G arena
USER arena

CMD ["node", "src/index.js"]
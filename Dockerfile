# ------------------------------------------------------------------------------
# Zeonix eCards — production image
# Multi-stage build: installs deps, builds the frontend, ships a slim runtime
# with only production dependencies. Works on Railway, Render, Fly.io,
# Google Cloud Run, and any Docker-capable VPS.
# ------------------------------------------------------------------------------

# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# Install all dependencies (dev deps needed for the TypeScript/Vite build)
COPY package.json package-lock.json ./
RUN npm ci

# Build the frontend (tsc + vite → dist/)
COPY . .
RUN npm run build

# Prune to production dependencies only
RUN npm prune --omit=dev

# ---------- Runtime stage ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
# Non-root user for security
RUN addgroup -S nodejs && adduser -S zeonix -G nodejs

# Copy production node_modules, the server, and the built frontend
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/server ./server
COPY --from=build /app/dist ./dist

# Data directory for inquiry submissions — mount a volume here in production
# so submissions survive redeploys:  -v zeonix-data:/data  -e DATA_DIR=/data
RUN mkdir -p /data && chown -R zeonix:nodejs /data
ENV DATA_DIR=/data
VOLUME ["/data"]

USER zeonix

# Railway/Render/Fly inject PORT; default matches the repo's dev API port
ENV PORT=3001
EXPOSE 3001

# Healthcheck-friendly: GET /api/health returns 200
CMD ["node", "server/index.mjs"]

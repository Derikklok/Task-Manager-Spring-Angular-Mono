# Stage 1: Build Angular app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build production bundle
RUN pnpm build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy built app from builder stage
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Create assets directory for env-config.js
RUN mkdir -p /usr/share/nginx/html/assets

# Expose port
EXPOSE 80

# Use entrypoint to substitute environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]

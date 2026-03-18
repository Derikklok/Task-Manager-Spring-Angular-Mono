#!/bin/sh

# Generate env-config.js from environment variables
cat > /usr/share/nginx/html/assets/env-config.js << 'EOF'
// This file is generated at runtime from environment variables
// Uses relative path /api which Nginx will proxy to backend:8080/api
(function (window) {
  window.__env = window.__env || {};

  // API Base URL - use relative path so Nginx proxy can forward to backend
  // Browser will reach http://localhost:4200/api which Nginx proxies to backend:8080/api
  window.__env.apiBaseUrl = '/api';
}(window));
EOF

# Note: We use relative path /api instead of absolute http://backend:8080/api because:
# 1. The browser runs on the HOST and cannot resolve Docker service hostname "backend"
# 2. Nginx is configured to proxy /api/* requests to http://backend:8080/api/
# 3. This works in both Docker and local development environments

# Start nginx
exec nginx -g 'daemon off;'



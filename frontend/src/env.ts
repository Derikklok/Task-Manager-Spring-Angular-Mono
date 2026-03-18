// API URL Configuration
// Use relative path /api which Nginx will proxy to backend:8080/api
// This works in Docker (Nginx proxies) and local development (dev server proxies)
export const environment = {
  production: false,
  apiBaseUrl: '/api'
};

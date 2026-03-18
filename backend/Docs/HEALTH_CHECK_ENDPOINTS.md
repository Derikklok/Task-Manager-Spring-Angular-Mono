# Health Check Endpoints Documentation

## Overview

The Health Check Controller provides public endpoints for monitoring application health. These endpoints **do NOT require JWT authentication** and are used by Docker Compose, load balancers, and monitoring tools.

---

## 📍 Endpoints

### 1. Simple Health Check
**Endpoint:** `GET /api/health`

**Description:** Returns a simple "OK" response to indicate the service is running.

**Authentication:** None (Public)

**Request:**
```bash
curl http://localhost:8080/api/health
```

**Response (200 OK):**
```
OK
```

**Use Cases:**
- Docker health checks
- Load balancer health probes
- Basic availability monitoring
- Simple health verification scripts

---

### 2. Detailed Health Check
**Endpoint:** `GET /api/health/detailed`

**Description:** Returns detailed health information including status, timestamp, and version.

**Authentication:** None (Public)

**Request:**
```bash
curl http://localhost:8080/api/health/detailed
```

**Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2026-03-18T13:34:50.123456",
  "service": "Task Manager Backend",
  "version": "0.0.1-SNAPSHOT",
  "environment": "docker"
}
```

**Use Cases:**
- Monitoring dashboards
- Health check API for management tools
- Detailed health status reporting
- Service version verification

---

### 3. Kubernetes Liveness Probe
**Endpoint:** `GET /api/health/live`

**Description:** Returns "LIVE" to indicate the service is alive. Used by Kubernetes liveness probes to determine if container should be restarted.

**Authentication:** None (Public)

**Request:**
```bash
curl http://localhost:8080/api/health/live
```

**Response (200 OK):**
```
LIVE
```

**Kubernetes Configuration:**
```yaml
livenessProbe:
  httpGet:
    path: /api/health/live
    port: 8080
  initialDelaySeconds: 40
  periodSeconds: 30
  timeoutSeconds: 10
  failureThreshold: 3
```

---

### 4. Kubernetes Readiness Probe
**Endpoint:** `GET /api/health/ready`

**Description:** Returns "READY" to indicate the service is ready to handle requests. Used by Kubernetes readiness probes to determine if traffic should be sent.

**Authentication:** None (Public)

**Request:**
```bash
curl http://localhost:8080/api/health/ready
```

**Response (200 OK):**
```
READY
```

**Kubernetes Configuration:**
```yaml
readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

---

## 🐳 Docker Compose Integration

The health check is configured in `docker-compose.yml`:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
  interval: 30s          # Check every 30 seconds
  timeout: 10s           # Wait max 10 seconds for response
  retries: 3             # Retry 3 times before marking unhealthy
  start_period: 40s      # Wait 40 seconds before starting checks
```

### How it Works

1. **Start Period (40s):** Container starts, waits 40 seconds before first health check
2. **Check (Every 30s):** Calls `GET /api/localhost:8080/api/health`
3. **Response (< 10s):** Expects "OK" response within 10 seconds
4. **Failure Handling:** 3 consecutive failures = unhealthy container
5. **Auto-Restart:** Container automatically restarts if unhealthy

### Check Status

View health status:
```bash
docker-compose ps
```

Look for health status in the output:
```
NAME                         STATUS
task-manager-backend         Up X minutes (healthy)
task-manager-mysql           Up X minutes (healthy)
```

---

## 🔍 Monitoring

### Manual Health Check

```bash
# Simple health check
curl http://localhost:8080/api/health

# Detailed health check
curl http://localhost:8080/api/health/detailed

# Check response time
time curl http://localhost:8080/api/health

# Include response headers
curl -i http://localhost:8080/api/health
```

### Watch Health Status

```bash
# Monitor in real-time
watch 'docker-compose ps | grep task-manager'

# Check logs if unhealthy
docker-compose logs backend

# Check specific health check logs
docker inspect task-manager-backend | grep -A 20 "Health"
```

### Docker Health Events

```bash
# Monitor health events
docker events --filter 'type=container' --filter 'name=task-manager-backend'

# Check last 100 health checks
docker inspect task-manager-backend --format='{{json .State.Health}}' | jq .
```

---

## 📊 Health Check Configuration Reference

### Timing

- **interval:** How often to run the check (default: 30s)
- **timeout:** Maximum time to wait for response (default: 10s)
- **start_period:** Grace period before first check (default: 40s)
- **retries:** Failures allowed before unhealthy (default: 3)

### Status Transitions

```
STARTING → (after start_period) → HEALTHY/UNHEALTHY

HEALTHY:   All checks pass
UNHEALTHY: retries consecutive failures
STARTING:  Container starting, checks not yet run
```

---

## 🛠️ Troubleshooting

### Container Shows "Unhealthy"

**Possible Causes:**
1. Application not fully started (increase `start_period`)
2. High CPU/memory causing slow response (increase `timeout`)
3. Network issues preventing curl
4. Application crashed

**Solutions:**
```bash
# Check logs
docker-compose logs backend

# Increase start period in docker-compose.yml
start_period: 60s

# Test health endpoint manually
curl -v http://localhost:8080/api/health

# Check container resources
docker stats task-manager-backend
```

### Health Check Endpoint Returns 500

**Cause:** Application error

**Solution:**
```bash
# Check application logs
docker-compose logs backend

# Connect to container
docker-compose exec backend bash

# Test within container
curl http://localhost:8080/api/health
```

### Curl Command Not Found in Container

**Cause:** curl not installed in base image

**Note:** Our Alpine JRE image includes curl, but check if using custom image:

```dockerfile
# Add curl to Alpine if needed
RUN apk add --no-cache curl
```

---

## 📈 Health Metrics

### Latency Targets
- **Ideal:** < 100ms
- **Acceptable:** < 500ms
- **Warning:** 500ms - 1s
- **Critical:** > 1s

### Check Your Latency

```bash
# Measure response time
time curl http://localhost:8080/api/health

# Repeat 10 times and average
for i in {1..10}; do
  echo "Check $i:"
  time curl -s http://localhost:8080/api/health
  echo
done
```

---

## 🔐 Security Note

**Why no authentication required?**
- Health checks are monitoring endpoints, not API endpoints
- They only return status, no sensitive data
- Blocking them would prevent proper monitoring
- Production deployments should use separate internal networks

**Best Practices:**
- Keep health endpoints simple (no database queries)
- Don't expose sensitive information
- Consider using network policies in production
- Monitor who accesses health endpoints

---

## 🚀 Advanced: Custom Health Checks

To add custom health check logic (e.g., database connectivity):

```java
@GetMapping("/db")
public ResponseEntity<String> databaseHealth() {
    try {
        // Test database connection
        // Example: repository.count()
        return ResponseEntity.ok("DB_OK");
    } catch (Exception e) {
        return ResponseEntity.status(503).body("DB_FAILED");
    }
}
```

Then update docker-compose:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/api/health/db"]
```

---

## 📚 References

- [Docker Health Checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Kubernetes Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Spring Boot Health Endpoints](https://spring.io/guides/gs/spring-boot-docker/)

---

**Date:** March 18, 2026  
**Status:** ✓ COMPLETE



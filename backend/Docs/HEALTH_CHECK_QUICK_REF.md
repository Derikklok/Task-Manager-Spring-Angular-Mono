# Health Check Quick Reference

## 🚀 Quick Commands

```bash
# Test simple health
curl http://localhost:8080/api/health

# Test detailed health
curl http://localhost:8080/api/health/detailed

# Test Kubernetes liveness
curl http://localhost:8080/api/health/live

# Test Kubernetes readiness
curl http://localhost:8080/api/health/ready

# Check Docker health
docker-compose ps

# View health details
docker inspect task-manager-backend | grep -A 20 "Health"

# Watch health status
watch 'docker-compose ps | grep task-manager'
```

---

## 📍 All Endpoints

| Endpoint | Response | Authentication | Use Case |
|----------|----------|-----------------|----------|
| GET /api/health | OK | None | Docker, Load Balancers |
| GET /api/health/detailed | JSON | None | Monitoring, Debugging |
| GET /api/health/live | LIVE | None | Kubernetes Liveness |
| GET /api/health/ready | READY | None | Kubernetes Readiness |

---

## 🐳 Docker Health Check

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**What it does:**
- Waits 40 seconds after container starts
- Every 30 seconds, calls the health endpoint
- If response takes > 10 seconds, marks as failed
- After 3 consecutive failures, restarts container

---

## ⚙️ Kubernetes Configuration

```yaml
livenessProbe:
  httpGet:
    path: /api/health/live
    port: 8080
  initialDelaySeconds: 40
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 10
```

---

## ✅ Verification

✓ No JWT token needed  
✓ Works without authentication  
✓ Docker properly monitors health  
✓ Auto-restart on failure  
✓ Kubernetes probe compatible  

---

**Status:** Complete | **Date:** March 18, 2026

